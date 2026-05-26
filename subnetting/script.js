let currentMode = 'subnets'; // 'subnets' or 'hosts'
let baseNetworkData = null;

function switchTab(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const label = document.getElementById('reqLabel');
    const input = document.getElementById('requirement');
    
    if (mode === 'subnets') {
        label.textContent = 'Number of Departments (Subnets) Needed';
        input.placeholder = 'e.g. 4';
    } else {
        label.textContent = 'Number of Users (Hosts) Needed per Subnet';
        input.placeholder = 'e.g. 50';
    }
    
    calculateSubnets();
}

function analyzeIP() {
    const ipInput = document.getElementById('ipAddress').value.trim();
    const feedback = document.getElementById('ipFeedback');
    const ipClassEl = document.getElementById('ipClass');
    const defaultMaskEl = document.getElementById('defaultMask');
    
    // Reset
    baseNetworkData = null;
    ipClassEl.textContent = '-';
    defaultMaskEl.textContent = '-';
    feedback.textContent = '';
    feedback.className = 'feedback';
    document.getElementById('calculationResults').style.display = 'none';

    if (!ipInput) return;

    const ipParts = ipInput.split('.');
    if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part === '' || part < 0 || part > 255)) {
        feedback.textContent = 'Invalid IP address format.';
        feedback.className = 'feedback error';
        return;
    }

    const firstOctet = parseInt(ipParts[0]);
    let ipClass = '';
    let defaultMask = '';
    let defaultPrefix = 0;

    if (firstOctet >= 1 && firstOctet <= 126) {
        ipClass = 'A';
        defaultMask = '255.0.0.0';
        defaultPrefix = 8;
    } else if (firstOctet === 127) {
        feedback.textContent = 'Loopback address (127.x.x.x) is reserved.';
        feedback.className = 'feedback error';
        return;
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = 'B';
        defaultMask = '255.255.0.0';
        defaultPrefix = 16;
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = 'C';
        defaultMask = '255.255.255.0';
        defaultPrefix = 24;
    } else {
        feedback.textContent = 'IP must be Class A, B, or C (D and E are reserved).';
        feedback.className = 'feedback error';
        return;
    }

    ipClassEl.textContent = `Class ${ipClass}`;
    defaultMaskEl.textContent = `/${defaultPrefix} (${defaultMask})`;
    feedback.textContent = 'Valid IP address.';
    feedback.className = 'feedback success';

    baseNetworkData = {
        ip: ipParts.map(Number),
        ipClass,
        defaultPrefix
    };

    calculateSubnets();
}

function ipToLong(ipParts) {
    return (ipParts[0] << 24 | ipParts[1] << 16 | ipParts[2] << 8 | ipParts[3]) >>> 0;
}

function longToIp(long) {
    return [
        (long >>> 24) & 255,
        (long >>> 16) & 255,
        (long >>> 8) & 255,
        long & 255
    ].join('.');
}

function prefixToMaskLong(prefix) {
    return prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
}

function calculateSubnets() {
    const reqInput = parseInt(document.getElementById('requirement').value);
    const resultsCard = document.getElementById('calculationResults');
    
    if (!baseNetworkData || isNaN(reqInput) || reqInput <= 0) {
        resultsCard.style.display = 'none';
        return;
    }

    const hostBitsAvailable = 32 - baseNetworkData.defaultPrefix;
    let borrowedBits = 0;
    let newPrefix = baseNetworkData.defaultPrefix;

    if (currentMode === 'subnets') {
        // Find borrowed bits based on required subnets: 2^n >= reqInput
        while (Math.pow(2, borrowedBits) < reqInput) {
            borrowedBits++;
        }
    } else {
        // Find required host bits: 2^h - 2 >= reqInput
        let requiredHostBits = 1;
        while (Math.pow(2, requiredHostBits) - 2 < reqInput) {
            requiredHostBits++;
        }
        borrowedBits = hostBitsAvailable - requiredHostBits;
    }

    if (borrowedBits < 0 || borrowedBits > hostBitsAvailable - 2) {
        alert("Requirement exceeds available network space for this IP class.");
        resultsCard.style.display = 'none';
        return;
    }

    newPrefix += borrowedBits;
    const remainingHostBits = 32 - newPrefix;
    const hostsPerSubnet = Math.pow(2, remainingHostBits) - 2;
    const numSubnets = Math.pow(2, borrowedBits);
    
    const newMaskLong = prefixToMaskLong(newPrefix);
    const newMaskStr = longToIp(newMaskLong);

    // Update UI Summary
    document.getElementById('borrowedBits').textContent = borrowedBits;
    document.getElementById('newMask').textContent = `/${newPrefix} (${newMaskStr})`;
    document.getElementById('hostsPerSubnet').textContent = hostsPerSubnet;

    // Calculate Table
    const tbody = document.querySelector('#subnetTable tbody');
    tbody.innerHTML = '';

    const baseIpLong = ipToLong(baseNetworkData.ip);
    const networkLong = (baseIpLong & prefixToMaskLong(baseNetworkData.defaultPrefix)) >>> 0; 
    
    // Step size
    const step = Math.pow(2, remainingHostBits);
    
    // Limit displaying to first 1000 subnets to prevent browser freezing
    const displayLimit = Math.min(numSubnets, 1000); 

    for (let i = 0; i < displayLimit; i++) {
        const subNetLong = networkLong + (i * step);
        const subBroadLong = subNetLong + step - 1;
        
        const subNetIp = longToIp(subNetLong);
        const firstUsable = longToIp(subNetLong + 1);
        const lastUsable = longToIp(subBroadLong - 1);
        const broadcast = longToIp(subBroadLong);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${subNetIp}</td>
            <td>${firstUsable} - ${lastUsable}</td>
            <td>${broadcast}</td>
        `;
        tbody.appendChild(row);
    }
    
    if (numSubnets > 1000) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">Showing first 1,000 subnets out of ${numSubnets.toLocaleString()} total subnets.</td>`;
        tbody.appendChild(row);
    }

    resultsCard.style.display = 'block';
}
