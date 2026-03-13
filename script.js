// ===== GLOB AI – AI-Driven Cybersecurity Assistant =====
// Main Application Logic

(function () {
    'use strict';

    // ===== DOM Elements =====
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const navBtns = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.panel');
    const chatMessages = document.getElementById('chat-messages');
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');
    const attachmentPreview = document.getElementById('attachment-preview');
    const attachmentName = document.getElementById('attachment-name');
    const removeAttachment = document.getElementById('remove-attachment');
    const clearChat = document.getElementById('clear-chat');
    const urlInput = document.getElementById('url-input');
    const scanBtn = document.getElementById('scan-btn');
    const scanResult = document.getElementById('scan-result');
    const scansList = document.getElementById('scans-list');
    const historyList = document.getElementById('history-list');

    // ===== State =====
    let currentFile = null;
    let isRecording = false;
    let recognition = null;
    let scanHistory = [];
    let stats = { safe: 0, suspicious: 0, unsafe: 0, total: 0 };

    // ===== Particles.js Init =====
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 900 } },
                    color: { value: ['#00f5ff', '#7b2fff', '#00ff88'] },
                    shape: { type: 'circle' },
                    opacity: { value: 0.4, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1 } },
                    size: { value: 2.5, random: true, anim: { enable: true, speed: 2, size_min: 0.5 } },
                    line_linked: {
                        enable: true, distance: 150, color: '#00f5ff',
                        opacity: 0.12, width: 1
                    },
                    move: {
                        enable: true, speed: 1.2, direction: 'none',
                        random: true, straight: false, out_mode: 'out',
                        attract: { enable: true, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'grab' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 0.35 } },
                        push: { particles_nb: 3 }
                    }
                },
                retina_detect: true
            });
        }
    }

    // ===== Navigation =====
    function switchPanel(panelName) {
        panels.forEach(p => p.classList.remove('active'));
        navBtns.forEach(b => b.classList.remove('active'));

        const panel = document.getElementById(`panel-${panelName}`);
        const btn = document.querySelector(`[data-panel="${panelName}"]`);

        if (panel) panel.classList.add('active');
        if (btn) btn.classList.add('active');

        // Close mobile sidebar
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });

    // ===== Mobile Menu =====
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });

    // ===== Chat Functions =====
    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function detectURL(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        const matches = text.match(urlRegex);
        return matches ? matches[0] : null;
    }

    function addMessage(content, isUser = false, isHTML = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? '👤' : '🛡️'}</div>
            <div class="message-content">
                <div class="message-bubble">${isHTML ? content : sanitizeHTML(content)}</div>
                <span class="message-time">${isUser ? getCurrentTime() : 'GLOB AI'}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🛡️</div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // ===== Cybersecurity Knowledge Base =====
    const cyberKB = {
        'phishing': {
            answer: `<h3>🎣 Phishing Attacks</h3>
            <p><strong>Phishing</strong> is a type of social engineering attack where attackers disguise themselves as trustworthy entities to steal sensitive information like passwords, credit card numbers, and personal data.</p>
            <p><strong>Common types:</strong></p>
            <ul>
                <li>📧 <strong>Email Phishing</strong> – Fake emails from seemingly legitimate sources</li>
                <li>🎯 <strong>Spear Phishing</strong> – Targeted attacks on specific individuals</li>
                <li>🐋 <strong>Whaling</strong> – Attacks targeting senior executives</li>
                <li>📱 <strong>Smishing</strong> – Phishing via SMS messages</li>
            </ul>
            <p><strong>How to protect yourself:</strong></p>
            <ul>
                <li>✅ Verify sender email addresses carefully</li>
                <li>✅ Don't click on suspicious links</li>
                <li>✅ Enable two-factor authentication (2FA)</li>
                <li>✅ Use GLOB AI to scan suspicious URLs!</li>
            </ul>`
        },
        'malware': {
            answer: `<h3>🦠 Malware (Malicious Software)</h3>
            <p><strong>Malware</strong> is any software designed to cause damage, steal data, or gain unauthorized access to systems.</p>
            <p><strong>Types of malware:</strong></p>
            <ul>
                <li>🔒 <strong>Ransomware</strong> – Encrypts your files and demands payment</li>
                <li>🐴 <strong>Trojans</strong> – Disguised as legitimate software</li>
                <li>🐛 <strong>Worms</strong> – Self-replicating malware that spreads across networks</li>
                <li>👁️ <strong>Spyware</strong> – Secretly monitors your activity</li>
                <li>📢 <strong>Adware</strong> – Forces unwanted advertisements</li>
            </ul>
            <p><strong>Prevention tips:</strong></p>
            <ul>
                <li>✅ Keep your OS and software updated</li>
                <li>✅ Use reputable antivirus software</li>
                <li>✅ Don't download from untrusted sources</li>
                <li>✅ Scan suspicious links with GLOB AI</li>
            </ul>`
        },
        'ransomware': {
            answer: `<h3>🔒 Ransomware</h3>
            <p><strong>Ransomware</strong> is a type of malware that encrypts your files and demands a ransom payment for the decryption key.</p>
            <p><strong>Notable attacks:</strong> WannaCry (2017), Colonial Pipeline (2021), Kaseya (2021)</p>
            <p><strong>How it spreads:</strong></p>
            <ul>
                <li>📧 Phishing emails with infected attachments</li>
                <li>🌐 Compromised websites (drive-by downloads)</li>
                <li>🔌 Exploiting unpatched vulnerabilities</li>
                <li>📡 Remote Desktop Protocol (RDP) attacks</li>
            </ul>
            <p><strong>Protection measures:</strong></p>
            <ul>
                <li>✅ Regular data backups (offline & cloud)</li>
                <li>✅ Keep systems patched and updated</li>
                <li>✅ Network segmentation</li>
                <li>✅ Employee security awareness training</li>
                <li>✅ Never pay the ransom</li>
            </ul>`
        },
        'password': {
            answer: `<h3>🔑 Password Security</h3>
            <p>Strong passwords are your first line of defense against unauthorized access.</p>
            <p><strong>Best practices:</strong></p>
            <ul>
                <li>📏 Use at least 12-16 characters</li>
                <li>🔤 Mix uppercase, lowercase, numbers, and symbols</li>
                <li>🚫 Avoid personal information (names, birthdays)</li>
                <li>🔄 Use unique passwords for each account</li>
                <li>🗄️ Use a password manager (Bitwarden, 1Password, KeePass)</li>
                <li>🔐 Enable Two-Factor Authentication (2FA) everywhere</li>
            </ul>
            <p><strong>⚠️ Weak passwords to avoid:</strong> 123456, password, qwerty, admin, your name/birthday</p>`
        },
        'vpn': {
            answer: `<h3>🌐 VPN (Virtual Private Network)</h3>
            <p>A <strong>VPN</strong> creates an encrypted tunnel between your device and the internet, protecting your data from eavesdropping.</p>
            <p><strong>Benefits:</strong></p>
            <ul>
                <li>🔒 Encrypts your internet traffic</li>
                <li>🌍 Masks your IP address and location</li>
                <li>📶 Protects on public Wi-Fi networks</li>
                <li>🚫 Bypasses geo-restrictions</li>
            </ul>
            <p><strong>When to use a VPN:</strong></p>
            <ul>
                <li>☕ On public Wi-Fi (cafes, airports, hotels)</li>
                <li>💼 When working remotely</li>
                <li>🏦 When accessing sensitive accounts</li>
                <li>🔍 When you want to browse privately</li>
            </ul>`
        },
        'firewall': {
            answer: `<h3>🧱 Firewall</h3>
            <p>A <strong>firewall</strong> monitors and controls incoming and outgoing network traffic based on security rules.</p>
            <p><strong>Types of firewalls:</strong></p>
            <ul>
                <li>📦 <strong>Packet Filtering</strong> – Inspects individual packets</li>
                <li>🔄 <strong>Stateful Inspection</strong> – Tracks connection states</li>
                <li>🌐 <strong>Application Layer</strong> – Deep packet inspection</li>
                <li>☁️ <strong>Cloud Firewalls</strong> – Cloud-based protection</li>
            </ul>
            <p><strong>Best practices:</strong></p>
            <ul>
                <li>✅ Always keep your firewall enabled</li>
                <li>✅ Configure rules properly</li>
                <li>✅ Regularly review and update rules</li>
                <li>✅ Use both hardware and software firewalls</li>
            </ul>`
        },
        'ddos': {
            answer: `<h3>💥 DDoS (Distributed Denial of Service)</h3>
            <p>A <strong>DDoS attack</strong> overwhelms a target with massive amounts of traffic to make it unavailable.</p>
            <p><strong>Types:</strong></p>
            <ul>
                <li>🌊 <strong>Volumetric</strong> – Floods bandwidth (UDP flood, DNS amplification)</li>
                <li>📡 <strong>Protocol</strong> – Exploits protocol weaknesses (SYN flood)</li>
                <li>🌐 <strong>Application Layer</strong> – Targets specific services (HTTP flood)</li>
            </ul>
            <p><strong>Mitigation:</strong></p>
            <ul>
                <li>✅ Use CDN services (Cloudflare, Akamai)</li>
                <li>✅ Rate limiting and traffic filtering</li>
                <li>✅ Over-provision bandwidth</li>
                <li>✅ Have an incident response plan</li>
            </ul>`
        },
        'social engineering': {
            answer: `<h3>🎭 Social Engineering</h3>
            <p><strong>Social engineering</strong> manipulates people into revealing confidential information or taking actions that compromise security.</p>
            <p><strong>Common techniques:</strong></p>
            <ul>
                <li>🎣 <strong>Phishing</strong> – Fake emails/websites</li>
                <li>📞 <strong>Vishing</strong> – Phone-based scams</li>
                <li>🎁 <strong>Baiting</strong> – Luring with free items</li>
                <li>👔 <strong>Pretexting</strong> – Creating false scenarios</li>
                <li>🚪 <strong>Tailgating</strong> – Following authorized people into secure areas</li>
            </ul>
            <p><strong>Defense strategies:</strong></p>
            <ul>
                <li>✅ Verify identities before sharing information</li>
                <li>✅ Be skeptical of unsolicited requests</li>
                <li>✅ Security awareness training</li>
                <li>✅ Implement verification procedures</li>
            </ul>`
        },
        '2fa': {
            answer: `<h3>🔐 Two-Factor Authentication (2FA)</h3>
            <p><strong>2FA</strong> adds an extra layer of security by requiring two different types of verification.</p>
            <p><strong>Types of 2FA:</strong></p>
            <ul>
                <li>📱 <strong>SMS Codes</strong> – One-time codes via text message</li>
                <li>📲 <strong>Authenticator Apps</strong> – Google Authenticator, Authy</li>
                <li>🔑 <strong>Hardware Keys</strong> – YubiKey, Titan Security Key</li>
                <li>👆 <strong>Biometrics</strong> – Fingerprint, face recognition</li>
            </ul>
            <p><strong>Why it's important:</strong> Even if your password is compromised, 2FA prevents unauthorized access.</p>
            <p><strong>💡 Tip:</strong> Use authenticator apps over SMS for better security!</p>`
        },
        'encryption': {
            answer: `<h3>🔐 Encryption</h3>
            <p><strong>Encryption</strong> converts readable data into an unreadable format that can only be decoded with the correct key.</p>
            <p><strong>Types:</strong></p>
            <ul>
                <li>🔑 <strong>Symmetric</strong> – Same key for encryption & decryption (AES, DES)</li>
                <li>🔐 <strong>Asymmetric</strong> – Public & private key pair (RSA, ECC)</li>
                <li>🔒 <strong>End-to-End (E2E)</strong> – Only communicating parties can read (Signal, WhatsApp)</li>
            </ul>
            <p><strong>Where it's used:</strong></p>
            <ul>
                <li>🌐 HTTPS websites (TLS/SSL)</li>
                <li>💬 Messaging apps</li>
                <li>💾 Disk encryption (BitLocker, FileVault)</li>
                <li>📧 Email encryption (PGP, S/MIME)</li>
            </ul>`
        }
    };

    // ===== Synonym/Keyword Map for smarter matching =====
    const keywordMap = {
        'phishing': ['phishing', 'phish', 'fake email', 'scam email', 'email scam', 'spear phishing', 'whaling', 'smishing'],
        'malware': ['malware', 'virus', 'trojan', 'worm', 'spyware', 'adware', 'infected', 'infection', 'malicious software'],
        'ransomware': ['ransomware', 'ransom', 'wannacry', 'encrypt my files', 'files encrypted', 'locked files'],
        'password': ['password', 'passwords', 'passphrase', 'credential', 'credentials', 'strong password', 'weak password', 'password manager'],
        'vpn': ['vpn', 'virtual private network', 'private browsing', 'hide ip', 'ip address hide', 'anonymous browsing'],
        'firewall': ['firewall', 'fire wall', 'network filter', 'packet filter', 'port blocking'],
        'ddos': ['ddos', 'dos attack', 'denial of service', 'flooding attack', 'traffic flood'],
        'social engineering': ['social engineering', 'pretexting', 'baiting', 'tailgating', 'impersonation', 'manipulation attack'],
        '2fa': ['2fa', 'two factor', 'two-factor', 'mfa', 'multi factor', 'multi-factor', 'authenticator', 'otp', 'one time password'],
        'encryption': ['encryption', 'encrypt', 'decrypt', 'decryption', 'aes', 'rsa', 'cipher', 'cryptography', 'end to end', 'e2e']
    };

    // ===== Extended Knowledge Base =====
    const extendedKB = {
        'hacker': `<h3>💻 Hackers & Hacking</h3>
        <p><strong>Hacking</strong> refers to exploiting weaknesses in systems, networks, or software to gain unauthorized access.</p>
        <p><strong>Types of hackers:</strong></p>
        <ul>
            <li>🎩 <strong>White Hat</strong> – Ethical hackers who help improve security</li>
            <li>🖤 <strong>Black Hat</strong> – Malicious hackers who exploit vulnerabilities for personal gain</li>
            <li>🩶 <strong>Grey Hat</strong> – Operate between ethical and malicious hacking</li>
            <li>📜 <strong>Script Kiddies</strong> – Use pre-made tools without deep understanding</li>
            <li>🏛️ <strong>Hacktivists</strong> – Hack for political or social causes</li>
        </ul>
        <p><strong>How to protect yourself:</strong></p>
        <ul>
            <li>✅ Keep all software and OS updated</li>
            <li>✅ Use strong, unique passwords with 2FA</li>
            <li>✅ Be cautious of unsolicited messages and links</li>
            <li>✅ Use a firewall and antivirus software</li>
        </ul>`,
        'darkweb': `<h3>🌑 Dark Web</h3>
        <p>The <strong>Dark Web</strong> is a hidden part of the internet that requires special software (like Tor) to access.</p>
        <p><strong>Key facts:</strong></p>
        <ul>
            <li>🌐 <strong>Surface Web</strong> – What Google indexes (~5% of internet)</li>
            <li>🔍 <strong>Deep Web</strong> – Databases, private pages, medical records</li>
            <li>🌑 <strong>Dark Web</strong> – Intentionally hidden, requires Tor browser</li>
        </ul>
        <p><strong>Dangers:</strong> Stolen data markets, illegal services, malware distribution, identity theft</p>
        <p><strong>⚠️ Warning:</strong> Accessing dark web markets is illegal and extremely dangerous. Your data could be at risk.</p>`,
        'wifi': `<h3>📶 Wi-Fi Security</h3>
        <p>Unsecured Wi-Fi networks are a major cybersecurity risk.</p>
        <p><strong>Threats on public Wi-Fi:</strong></p>
        <ul>
            <li>👀 <strong>Eavesdropping</strong> – Attackers can intercept your data</li>
            <li>🎭 <strong>Evil Twin</strong> – Fake Wi-Fi hotspots that steal data</li>
            <li>🔓 <strong>Man-in-the-Middle</strong> – Attackers intercept communication</li>
            <li>🦠 <strong>Malware injection</strong> – Pushing malware through the network</li>
        </ul>
        <p><strong>Protection tips:</strong></p>
        <ul>
            <li>✅ Always use a VPN on public Wi-Fi</li>
            <li>✅ Use WPA3 encryption on your home router</li>
            <li>✅ Change default router passwords</li>
            <li>✅ Disable auto-connect to open networks</li>
            <li>✅ Only visit HTTPS websites</li>
        </ul>`,
        'antivirus': `<h3>🛡️ Antivirus Software</h3>
        <p><strong>Antivirus</strong> software detects, prevents, and removes malicious software from your devices.</p>
        <p><strong>How it works:</strong></p>
        <ul>
            <li>📋 <strong>Signature-based</strong> – Matches known malware signatures</li>
            <li>🧠 <strong>Heuristic analysis</strong> – Detects new/unknown threats by behavior</li>
            <li>☁️ <strong>Cloud-based</strong> – Uses cloud databases for real-time detection</li>
            <li>🔒 <strong>Sandboxing</strong> – Runs suspicious files in isolated environment</li>
        </ul>
        <p><strong>Recommended antivirus:</strong> Windows Defender, Malwarebytes, Bitdefender, Kaspersky, Norton</p>
        <p><strong>💡 Tip:</strong> Keep your antivirus updated and run regular scans!</p>`,
        'cookie': `<h3>🍪 Cookies & Online Tracking</h3>
        <p><strong>Cookies</strong> are small data files stored by websites on your browser.</p>
        <p><strong>Types:</strong></p>
        <ul>
            <li>✅ <strong>Session cookies</strong> – Temporary, deleted when browser closes</li>
            <li>📦 <strong>Persistent cookies</strong> – Stay until expiry date</li>
            <li>👁️ <strong>Third-party cookies</strong> – Track you across websites (advertising)</li>
            <li>🔒 <strong>Secure cookies</strong> – Only sent over HTTPS</li>
        </ul>
        <p><strong>Privacy tips:</strong></p>
        <ul>
            <li>✅ Regularly clear cookies and browsing data</li>
            <li>✅ Use browser privacy mode</li>
            <li>✅ Install privacy extensions (uBlock Origin, Privacy Badger)</li>
            <li>✅ Reject unnecessary cookies on websites</li>
        </ul>`,
        'identity': `<h3>🆔 Identity Theft</h3>
        <p><strong>Identity theft</strong> occurs when someone steals your personal information to commit fraud.</p>
        <p><strong>How it happens:</strong></p>
        <ul>
            <li>📧 Phishing emails and fake websites</li>
            <li>🗑️ Dumpster diving for discarded documents</li>
            <li>📱 SIM swapping attacks</li>
            <li>💾 Data breaches exposing personal info</li>
            <li>📶 Public Wi-Fi eavesdropping</li>
        </ul>
        <p><strong>Prevention:</strong></p>
        <ul>
            <li>✅ Monitor your credit reports regularly</li>
            <li>✅ Use strong, unique passwords everywhere</li>
            <li>✅ Enable 2FA on all accounts</li>
            <li>✅ Shred sensitive documents</li>
            <li>✅ Be careful what you share on social media</li>
        </ul>`,
        'databreach': `<h3>💥 Data Breaches</h3>
        <p>A <strong>data breach</strong> occurs when unauthorized individuals access confidential data.</p>
        <p><strong>Major breaches:</strong> Yahoo (3B accounts), Equifax (147M), Facebook (533M), LinkedIn (700M)</p>
        <p><strong>What gets exposed:</strong></p>
        <ul>
            <li>📧 Email addresses and usernames</li>
            <li>🔑 Passwords (sometimes in plain text!)</li>
            <li>💳 Credit card and financial data</li>
            <li>🆔 Social security numbers</li>
        </ul>
        <p><strong>What to do if breached:</strong></p>
        <ul>
            <li>✅ Change passwords immediately</li>
            <li>✅ Enable 2FA on affected accounts</li>
            <li>✅ Check <strong>haveibeenpwned.com</strong> for your email</li>
            <li>✅ Monitor your bank statements</li>
            <li>✅ Consider a credit freeze</li>
        </ul>`,
        'cybersecurity': `<h3>🔐 What is Cybersecurity?</h3>
        <p><strong>Cybersecurity</strong> is the practice of protecting systems, networks, and data from digital attacks and unauthorized access.</p>
        <p><strong>Key areas:</strong></p>
        <ul>
            <li>🌐 <strong>Network Security</strong> – Protecting network infrastructure</li>
            <li>💻 <strong>Application Security</strong> – Securing software from threats</li>
            <li>☁️ <strong>Cloud Security</strong> – Protecting cloud-based data</li>
            <li>🆔 <strong>Identity Management</strong> – Controlling user access</li>
            <li>📊 <strong>Data Security</strong> – Protecting data integrity and privacy</li>
            <li>🏢 <strong>Operational Security</strong> – Processes for handling data</li>
        </ul>
        <p><strong>Career paths:</strong> Security Analyst, Penetration Tester, SOC Analyst, CISO, Security Engineer</p>`,
        'xss': `<h3>💉 XSS (Cross-Site Scripting)</h3>
        <p><strong>XSS</strong> is an attack where malicious scripts are injected into trusted websites.</p>
        <p><strong>Types:</strong></p>
        <ul>
            <li>📝 <strong>Stored XSS</strong> – Script saved on the server (most dangerous)</li>
            <li>🔗 <strong>Reflected XSS</strong> – Script embedded in URL</li>
            <li>🏗️ <strong>DOM-based XSS</strong> – Exploits client-side code</li>
        </ul>
        <p><strong>Prevention:</strong></p>
        <ul>
            <li>✅ Input validation and sanitization</li>
            <li>✅ Output encoding</li>
            <li>✅ Content Security Policy (CSP) headers</li>
            <li>✅ Use HttpOnly and Secure cookie flags</li>
        </ul>`,
        'sql': `<h3>🗃️ SQL Injection</h3>
        <p><strong>SQL Injection</strong> is an attack that inserts malicious SQL code into application queries to access or modify databases.</p>
        <p><strong>What attackers can do:</strong></p>
        <ul>
            <li>📖 Read sensitive data from databases</li>
            <li>✏️ Modify or delete database data</li>
            <li>👑 Execute admin operations</li>
            <li>📂 Read files from the server</li>
        </ul>
        <p><strong>Prevention:</strong></p>
        <ul>
            <li>✅ Use parameterized queries (prepared statements)</li>
            <li>✅ Input validation</li>
            <li>✅ Least privilege database accounts</li>
            <li>✅ Web Application Firewall (WAF)</li>
        </ul>`
    };

    // Extended keyword map for new topics
    const extendedKeywordMap = {
        'hacker': ['hack', 'hacker', 'hacking', 'hacked', 'ethical hacking', 'black hat', 'white hat', 'penetration test', 'pentest', 'exploit'],
        'darkweb': ['dark web', 'darkweb', 'deep web', 'tor browser', 'onion', 'hidden internet', 'silk road'],
        'wifi': ['wifi', 'wi-fi', 'wireless', 'hotspot', 'router', 'public wifi', 'network security', 'wpa', 'wpa2', 'wpa3'],
        'antivirus': ['antivirus', 'anti virus', 'anti-virus', 'virus scan', 'malware scan', 'windows defender', 'norton', 'mcafee', 'kaspersky', 'bitdefender'],
        'cookie': ['cookie', 'cookies', 'tracking', 'browser tracking', 'online tracking', 'privacy', 'browsing data', 'incognito'],
        'identity': ['identity theft', 'identity stolen', 'stolen identity', 'personal information stolen', 'sim swap', 'impersonate'],
        'databreach': ['data breach', 'breach', 'leaked', 'data leak', 'compromised', 'haveibeenpwned', 'exposed data', 'stolen data'],
        'cybersecurity': ['cybersecurity', 'cyber security', 'infosec', 'information security', 'cyber attack', 'cyber threat', 'security career'],
        'xss': ['xss', 'cross site scripting', 'cross-site scripting', 'script injection', 'javascript injection'],
        'sql': ['sql injection', 'sqli', 'database attack', 'database injection', 'sql attack']
    };

    // ===== AI Response Generator =====
    function generateAIResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase().trim();

        // Check for URL in message
        const detectedURL = detectURL(userMessage);
        if (detectedURL) {
            return generateURLAnalysisResponse(detectedURL);
        }

        // Check greetings first (exact short messages)
        const greetings = ['hello', 'hi', 'hey', 'hola', 'howdy', 'good morning', 'good evening', 'good afternoon', 'yo', 'sup', 'namaste', 'salam'];
        if (greetings.some(g => lowerMsg === g || lowerMsg === g + '!' || lowerMsg === g + '.' || lowerMsg.startsWith(g + ' ') || lowerMsg.startsWith(g + ','))) {
            const greetResponses = [
                `<p>Hello! 👋 I'm <strong>GLOB AI</strong>, your AI-powered cybersecurity assistant.</p>
                <p>I can help you with:</p>
                <ul>
                    <li>🔗 <strong>URL Safety Scanning</strong> – Paste any link to check if it's safe</li>
                    <li>🛡️ <strong>Cybersecurity Q&A</strong> – Ask about threats, attacks & protection</li>
                    <li>📚 <strong>Security Education</strong> – Learn about phishing, malware, VPNs & more</li>
                    <li>🎤 <strong>Voice Input</strong> – Click the mic to speak your question</li>
                </ul>
                <p>What would you like to know about cybersecurity today? 🚀</p>`,
                `<p>Hey there! 🛡️ Welcome to <strong>GLOB AI</strong>!</p>
                <p>I'm your cybersecurity guardian. Whether you want to:</p>
                <ul>
                    <li>🔍 Check if a URL is safe or malicious</li>
                    <li>🤔 Understand cyber threats like phishing or ransomware</li>
                    <li>🔑 Get tips on password security and 2FA</li>
                    <li>🌐 Learn about VPNs, firewalls, and encryption</li>
                </ul>
                <p>Just ask! I'm here to keep you safe online. 💪</p>`
            ];
            return greetResponses[Math.floor(Math.random() * greetResponses.length)];
        }

        // Check farewells
        const farewells = ['bye', 'goodbye', 'see you', 'later', 'take care', 'exit', 'quit'];
        if (farewells.some(f => lowerMsg.includes(f))) {
            return `<p>Goodbye! 👋 Stay safe online!</p>
            <p>Remember these quick tips before you go:</p>
            <ul>
                <li>🔐 Always use strong, unique passwords</li>
                <li>🔗 Don't click on suspicious links</li>
                <li>🛡️ Come back to GLOB AI anytime you need help!</li>
            </ul>
            <p>Stay vigilant! 🔒</p>`;
        }

        // Check thanks
        if (['thank', 'thanks', 'thx', 'appreciate', 'tysm', 'ty'].some(t => lowerMsg.includes(t))) {
            const thankResponses = [
                `<p>You're welcome! 😊 Stay safe out there! 🛡️</p><p>Feel free to ask me anything else about cybersecurity!</p>`,
                `<p>Happy to help! 🎉 Remember, cybersecurity awareness is your best defense.</p><p>Come back anytime you have questions or need a URL scanned! 🔗</p>`,
                `<p>Glad I could help! 💪 Your security is my priority.</p><p>Don't hesitate to ask if you have more questions! 🔐</p>`
            ];
            return thankResponses[Math.floor(Math.random() * thankResponses.length)];
        }

        // Check main knowledge base with synonym matching
        for (const [topic, synonyms] of Object.entries(keywordMap)) {
            if (synonyms.some(s => lowerMsg.includes(s))) {
                return cyberKB[topic].answer;
            }
        }

        // Check extended knowledge base with synonym matching
        for (const [topic, synonyms] of Object.entries(extendedKeywordMap)) {
            if (synonyms.some(s => lowerMsg.includes(s))) {
                return extendedKB[topic];
            }
        }

        // Safety / protection questions
        if (['safe', 'secure', 'protect', 'safety', 'security tips', 'stay safe', 'be safe', 'online safety'].some(k => lowerMsg.includes(k))) {
            return `<h3>🛡️ Stay Safe Online</h3>
            <p>Here are my top cybersecurity recommendations:</p>
            <ul>
                <li>🔑 Use strong, unique passwords for every account</li>
                <li>🔐 Enable Two-Factor Authentication (2FA) everywhere</li>
                <li>🤔 Be cautious of unsolicited emails, calls, and links</li>
                <li>📲 Keep your software, OS, and apps updated</li>
                <li>🌐 Use a VPN on public Wi-Fi</li>
                <li>💾 Regularly backup your important data</li>
                <li>🛡️ Install reputable antivirus software</li>
                <li>🔗 Use GLOB AI to scan suspicious URLs before clicking!</li>
            </ul>`;
        }

        // Help / capabilities
        if (['help', 'what can you do', 'features', 'capability', 'abilities', 'menu', 'options', 'what do you know'].some(k => lowerMsg.includes(k))) {
            return `<h3>🤖 GLOB AI Capabilities</h3>
            <p>Here's everything I can help you with:</p>
            <ul>
                <li>🔗 <strong>URL Analysis</strong> – Paste any link and I'll analyze it for threats</li>
                <li>🎣 <strong>Phishing</strong> – Learn about phishing attacks and how to avoid them</li>
                <li>🦠 <strong>Malware & Viruses</strong> – Types, prevention, and removal</li>
                <li>🔒 <strong>Ransomware</strong> – How it works and how to protect yourself</li>
                <li>🔑 <strong>Password Security</strong> – Creating and managing strong passwords</li>
                <li>🌐 <strong>VPN</strong> – How VPNs protect your privacy</li>
                <li>🧱 <strong>Firewalls</strong> – Network security fundamentals</li>
                <li>🔐 <strong>2FA / MFA</strong> – Multi-factor authentication setup</li>
                <li>🔐 <strong>Encryption</strong> – Data protection and cryptography</li>
                <li>🎭 <strong>Social Engineering</strong> – Human manipulation attacks</li>
                <li>💥 <strong>DDoS</strong> – Denial of service attacks</li>
                <li>💻 <strong>Hackers</strong> – Types and how they operate</li>
                <li>📶 <strong>Wi-Fi Security</strong> – Staying safe on wireless networks</li>
                <li>🆔 <strong>Identity Theft</strong> – Prevention and recovery</li>
                <li>💾 <strong>Data Breaches</strong> – What to do when data is exposed</li>
                <li>🍪 <strong>Cookies & Privacy</strong> – Online tracking and privacy</li>
                <li>💉 <strong>XSS & SQL Injection</strong> – Web application attacks</li>
            </ul>
            <p>Just type your question or paste a URL to get started! 🚀</p>`;
        }

        // What is / define / explain / tell me about patterns
        if (/^(what is|what are|what's|define|explain|tell me about|describe|how does|how do)\s/i.test(lowerMsg)) {
            // Try partial matching on all knowledge bases
            const allTopics = { ...cyberKB };
            for (const [k, v] of Object.entries(extendedKB)) { allTopics[k] = { answer: v }; }
            const allMaps = { ...keywordMap, ...extendedKeywordMap };

            for (const [topic, synonyms] of Object.entries(allMaps)) {
                if (synonyms.some(s => lowerMsg.includes(s))) {
                    return allTopics[topic]?.answer || cyberKB[topic]?.answer || extendedKB[topic];
                }
            }
        }

        // Smart default — suggest closest topics based on words
        const userWords = lowerMsg.split(/\s+/);
        const allMaps = { ...keywordMap, ...extendedKeywordMap };
        let bestMatch = null;
        let bestScore = 0;

        for (const [topic, synonyms] of Object.entries(allMaps)) {
            let score = 0;
            for (const word of userWords) {
                if (word.length < 3) continue;
                for (const syn of synonyms) {
                    if (syn.includes(word) || word.includes(syn.substring(0, 4))) {
                        score++;
                    }
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = topic;
            }
        }

        if (bestMatch && bestScore > 0) {
            return cyberKB[bestMatch]?.answer || extendedKB[bestMatch];
        }

        // Truly unknown — give helpful default with variety
        const defaults = [
            `<h3>🤖 I can help with that!</h3>
            <p>I'm specialized in cybersecurity topics. Here are some things you can ask me:</p>
            <ul>
                <li>🎣 "What is phishing?"</li>
                <li>🦠 "Tell me about malware"</li>
                <li>🔑 "How to create a strong password?"</li>
                <li>🌐 "What is a VPN?"</li>
                <li>💻 "What are the types of hackers?"</li>
                <li>📶 "How to stay safe on public Wi-Fi?"</li>
                <li>🔗 Or paste any URL to scan for threats!</li>
            </ul>`,
            `<h3>🛡️ Let me guide you!</h3>
            <p>I'm an AI cybersecurity assistant. Try asking me about:</p>
            <ul>
                <li>🔒 "What is ransomware?"</li>
                <li>🔐 "How does encryption work?"</li>
                <li>🎭 "What is social engineering?"</li>
                <li>🆔 "How to prevent identity theft?"</li>
                <li>💥 "What is a DDoS attack?"</li>
                <li>🌑 "Tell me about the dark web"</li>
                <li>🔗 Or paste a URL like https://example.com to scan!</li>
            </ul>`,
            `<h3>💡 Quick Tip!</h3>
            <p>I work best with cybersecurity-related questions! Try these:</p>
            <ul>
                <li>🍪 "What are cookies?"</li>
                <li>🛡️ "How does antivirus work?"</li>
                <li>💉 "What is XSS?"</li>
                <li>🗃️ "Explain SQL injection"</li>
                <li>💾 "What to do after a data breach?"</li>
                <li>🧱 "How does a firewall work?"</li>
                <li>🔗 Or paste any suspicious URL to analyze!</li>
            </ul>`
        ];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    // ===== URL Analysis =====
    function analyzeURL(url) {
        const suspiciousPatterns = [
            /bit\.ly/i, /tinyurl/i, /goo\.gl/i, /t\.co/i, /ow\.ly/i,
            /is\.gd/i, /buff\.ly/i, /adf\.ly/i, /shorte\.st/i
        ];

        const maliciousPatterns = [
            /free.*prize/i, /click.*here.*win/i, /login.*verify/i,
            /account.*suspended/i, /urgent.*action/i, /\.tk$/i,
            /\.ml$/i, /\.ga$/i, /\.cf$/i, /\.gq$/i,
            /paypal.*\.com\./i, /google.*\.com\./i, /facebook.*\.com\./i,
            /microsoft.*\.com\./i, /apple.*\.com\./i
        ];

        const safeDomains = [
            'google.com', 'github.com', 'microsoft.com', 'apple.com',
            'amazon.com', 'facebook.com', 'twitter.com', 'youtube.com',
            'linkedin.com', 'stackoverflow.com', 'wikipedia.org',
            'mozilla.org', 'cloudflare.com', 'netflix.com', 'reddit.com'
        ];

        let riskScore = 0;
        let findings = [];
        let domain = '';

        try {
            const urlObj = new URL(url);
            domain = urlObj.hostname;

            // Check for safe domains
            if (safeDomains.some(d => domain.endsWith(d))) {
                return {
                    status: 'safe',
                    score: 5,
                    domain: domain,
                    protocol: urlObj.protocol,
                    findings: ['Known trusted domain', 'Standard web protocol', 'No suspicious patterns detected'],
                    explanation: `This URL belongs to ${domain}, which is a well-known and trusted website. No security threats were detected.`
                };
            }

            // Check protocol
            if (urlObj.protocol !== 'https:') {
                riskScore += 25;
                findings.push('⚠️ Not using HTTPS (insecure connection)');
            } else {
                findings.push('✅ Uses HTTPS encryption');
            }

            // Check for IP address instead of domain
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
                riskScore += 30;
                findings.push('🚨 Uses IP address instead of domain name');
            }

            // Check for suspicious URL shorteners
            if (suspiciousPatterns.some(p => p.test(url))) {
                riskScore += 20;
                findings.push('⚠️ URL shortener detected (hides true destination)');
            }

            // Check for malicious patterns
            if (maliciousPatterns.some(p => p.test(url))) {
                riskScore += 40;
                findings.push('🚨 Suspicious patterns detected in URL');
            }

            // Check for excessive subdomains
            const subdomainCount = domain.split('.').length;
            if (subdomainCount > 3) {
                riskScore += 15;
                findings.push('⚠️ Excessive subdomains (possible spoofing)');
            }

            // Check for suspicious TLDs
            const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click', '.loan'];
            if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
                riskScore += 25;
                findings.push('⚠️ Suspicious top-level domain');
            }

            // Check for suspicious characters
            if (/[@%]/.test(url)) {
                riskScore += 20;
                findings.push('🚨 Suspicious characters in URL');
            }

            // Check URL length
            if (url.length > 200) {
                riskScore += 10;
                findings.push('⚠️ Unusually long URL');
            }

            if (findings.length <= 1) {
                findings.push('✅ Standard URL structure');
            }

        } catch (e) {
            return {
                status: 'unsafe',
                score: 80,
                domain: 'Invalid URL',
                protocol: 'N/A',
                findings: ['🚨 Invalid URL format'],
                explanation: 'The provided URL is not valid. This could indicate a malformed or intentionally obfuscated link.'
            };
        }

        let status = 'safe';
        if (riskScore >= 40) status = 'unsafe';
        else if (riskScore >= 15) status = 'suspicious';

        const explanation = status === 'safe'
            ? `This URL appears to be safe. No significant security threats were detected. However, always exercise caution when entering personal information.`
            : status === 'suspicious'
                ? `This URL has some suspicious characteristics. While it may be legitimate, we recommend caution. Avoid entering sensitive information and verify the source.`
                : `⚠️ WARNING: This URL shows multiple signs of being potentially malicious. We strongly recommend NOT visiting this link and NOT entering any personal information.`;

        return { status, score: Math.min(riskScore, 100), domain, protocol: new URL(url).protocol, findings, explanation };
    }

    function generateURLAnalysisResponse(url) {
        const result = analyzeURL(url);
        const statusEmoji = result.status === 'safe' ? '✅' : result.status === 'suspicious' ? '⚠️' : '🚨';
        const statusText = result.status.toUpperCase();
        const statusColor = result.status;

        // Add to scan history
        addToScanHistory(url, result);

        return `<h3>🔗 URL Analysis Report</h3>
        <div class="url-analysis-card ${statusColor}">
            <div class="url-analysis-header">
                <span style="font-size:1.5rem">${statusEmoji}</span>
                <span class="url-analysis-verdict ${statusColor}">${statusText}</span>
            </div>
            <p style="font-size:0.8rem;color:var(--text-secondary);word-break:break-all;margin-bottom:12px;">${sanitizeHTML(url)}</p>
            <div class="url-analysis-details">
                <div class="url-detail-item">
                    <span class="url-detail-label">Domain</span>
                    <span class="url-detail-value">${sanitizeHTML(result.domain)}</span>
                </div>
                <div class="url-detail-item">
                    <span class="url-detail-label">Protocol</span>
                    <span class="url-detail-value">${result.protocol.replace(':', '')}</span>
                </div>
                <div class="url-detail-item">
                    <span class="url-detail-label">Risk Score</span>
                    <span class="url-detail-value" style="color:${result.status === 'safe' ? 'var(--green)' : result.status === 'suspicious' ? 'var(--yellow)' : 'var(--red)'}">${result.score}/100</span>
                </div>
                <div class="url-detail-item">
                    <span class="url-detail-label">Status</span>
                    <span class="url-detail-value" style="color:${result.status === 'safe' ? 'var(--green)' : result.status === 'suspicious' ? 'var(--yellow)' : 'var(--red)'}">${statusText}</span>
                </div>
            </div>
        </div>
        <p style="margin-top:12px;"><strong>Findings:</strong></p>
        <ul>${result.findings.map(f => `<li>${f}</li>`).join('')}</ul>
        <p style="margin-top:10px;font-size:0.85rem;color:var(--text-secondary);">${result.explanation}</p>`;
    }

    // ===== Scan History =====
    function addToScanHistory(url, result) {
        const scan = {
            url,
            status: result.status,
            score: result.score,
            domain: result.domain,
            findings: result.findings,
            explanation: result.explanation,
            time: new Date().toLocaleString()
        };

        scanHistory.unshift(scan);
        stats[result.status]++;
        stats.total++;

        updateRecentScans();
        updateStats();
        updateHistoryList();
    }

    function updateRecentScans() {
        if (scanHistory.length === 0) return;

        const statusEmoji = { safe: '✅', suspicious: '⚠️', unsafe: '🚨' };

        scansList.innerHTML = scanHistory.slice(0, 10).map(scan => `
            <div class="scan-item ${scan.status}">
                <span class="scan-item-icon">${statusEmoji[scan.status]}</span>
                <div class="scan-item-info">
                    <div class="scan-item-url">${sanitizeHTML(scan.url)}</div>
                    <div class="scan-item-time">${scan.time}</div>
                </div>
                <span class="scan-item-badge ${scan.status}">${scan.status.toUpperCase()}</span>
            </div>
        `).join('');
    }

    function updateStats() {
        document.getElementById('safe-count').textContent = stats.safe;
        document.getElementById('suspicious-count').textContent = stats.suspicious;
        document.getElementById('unsafe-count').textContent = stats.unsafe;
        document.getElementById('total-count').textContent = stats.total;
    }

    function updateHistoryList() {
        if (scanHistory.length === 0) return;

        const statusEmoji = { safe: '✅', suspicious: '⚠️', unsafe: '🚨' };

        historyList.innerHTML = scanHistory.map(scan => `
            <div class="history-item ${scan.status}">
                <span style="font-size:1.3rem">${statusEmoji[scan.status]}</span>
                <div class="history-item-info">
                    <div class="history-item-url">${sanitizeHTML(scan.url)}</div>
                    <div class="history-item-meta">
                        <span>📊 Risk: ${scan.score}/100</span>
                        <span>🕐 ${scan.time}</span>
                    </div>
                </div>
                <span class="scan-item-badge ${scan.status}">${scan.status.toUpperCase()}</span>
            </div>
        `).join('');
    }

    // ===== Send Message =====
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message && !currentFile) return;

        // Add user message
        let displayMsg = message;
        if (currentFile) {
            displayMsg += displayMsg ? `\n📎 ${currentFile.name}` : `📎 ${currentFile.name}`;
        }
        addMessage(displayMsg, true);

        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        clearAttachment();

        // Show typing indicator
        addTypingIndicator();

        // Simulate AI processing delay
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Remove typing indicator and add response
        removeTypingIndicator();

        if (currentFile && !message) {
            addMessage(`<p>📁 I've received your file: <strong>${sanitizeHTML(currentFile.name)}</strong></p>
            <p>File type: ${currentFile.type || 'Unknown'}</p>
            <p>Size: ${(currentFile.size / 1024).toFixed(1)} KB</p>
            <p>✅ The file has been securely previewed. No execution of uploaded content was performed for your safety.</p>
            <p>⚠️ <strong>Security tip:</strong> Always scan files from unknown sources before opening them on your system.</p>`, false, true);
        } else {
            const response = generateAIResponse(message);
            addMessage(response, false, true);
        }

        currentFile = null;
    }

    // ===== URL Scanner (Dedicated Panel) =====
    function scanURL() {
        const url = urlInput.value.trim();
        if (!url) return;

        // Validate URL
        try {
            new URL(url);
        } catch {
            // Try adding https://
            try {
                new URL('https://' + url);
                urlInput.value = 'https://' + url;
            } catch {
                alert('Please enter a valid URL');
                return;
            }
        }

        const finalURL = urlInput.value.trim();

        // Show loading
        const scanBtnText = document.querySelector('.scan-btn-text');
        const scanLoader = document.querySelector('.scan-loader');
        scanBtnText.style.display = 'none';
        scanLoader.style.display = 'block';
        scanBtn.disabled = true;

        // Simulate analysis
        setTimeout(() => {
            const result = analyzeURL(finalURL);
            addToScanHistory(finalURL, result);
            displayScanResult(finalURL, result);

            // Reset button
            scanBtnText.style.display = 'inline';
            scanLoader.style.display = 'none';
            scanBtn.disabled = false;
        }, 1500 + Math.random() * 1000);
    }

    function displayScanResult(url, result) {
        const statusEmoji = { safe: '✅', suspicious: '⚠️', unsafe: '🚨' };
        const statusText = result.status.toUpperCase();

        const resultCard = document.getElementById('result-card');
        resultCard.className = `result-card glass-card ${result.status}`;

        const resultIcon = document.getElementById('result-icon');
        resultIcon.className = `result-icon ${result.status}`;
        resultIcon.textContent = statusEmoji[result.status];

        document.getElementById('result-verdict').textContent = `${statusText} – Risk Score: ${result.score}/100`;
        document.getElementById('result-verdict').style.color = result.status === 'safe' ? 'var(--green)' : result.status === 'suspicious' ? 'var(--yellow)' : 'var(--red)';
        document.getElementById('result-url').textContent = url;

        const detailGrid = document.getElementById('detail-grid');
        detailGrid.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Domain</span>
                <span class="detail-value">${sanitizeHTML(result.domain)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Protocol</span>
                <span class="detail-value">${result.protocol.replace(':', '').toUpperCase()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Risk Score</span>
                <span class="detail-value" style="color:${result.status === 'safe' ? 'var(--green)' : result.status === 'suspicious' ? 'var(--yellow)' : 'var(--red)'}">${result.score}/100</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Classification</span>
                <span class="detail-value" style="color:${result.status === 'safe' ? 'var(--green)' : result.status === 'suspicious' ? 'var(--yellow)' : 'var(--red)'}">${statusText}</span>
            </div>
            ${result.findings.map(f => `
                <div class="detail-item" style="grid-column: span 2;">
                    <span class="detail-value" style="font-family:var(--font-body);font-size:0.82rem;">${f}</span>
                </div>
            `).join('')}
        `;

        document.getElementById('result-explanation').textContent = result.explanation;
        scanResult.style.display = 'block';
        scanResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ===== Voice Input =====
    function initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            voiceBtn.title = 'Voice input not supported in this browser';
            voiceBtn.style.opacity = '0.3';
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            autoResizeInput();
            stopRecording();
        };

        recognition.onerror = () => {
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };
    }

    function startRecording() {
        if (!recognition) return;
        isRecording = true;
        voiceBtn.classList.add('recording');
        recognition.start();
    }

    function stopRecording() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        if (recognition) {
            try { recognition.stop(); } catch (e) { /* ignore */ }
        }
    }

    // ===== File Attachment =====
    function handleFileAttach(file) {
        if (!file) return;

        currentFile = file;
        attachmentName.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        attachmentPreview.style.display = 'block';
    }

    function clearAttachment() {
        currentFile = null;
        fileInput.value = '';
        attachmentPreview.style.display = 'none';
    }

    // ===== Auto-resize Input =====
    function autoResizeInput() {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    }

    // ===== Event Listeners =====
    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    userInput.addEventListener('input', autoResizeInput);

    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    attachBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileAttach(e.target.files[0]);
        }
    });

    removeAttachment.addEventListener('click', clearAttachment);

    clearChat.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        // Re-add welcome message
        const welcomeHTML = `
            <div class="message bot-message welcome-message">
                <div class="message-avatar">🛡️</div>
                <div class="message-content">
                    <div class="message-bubble">
                        <h3>Welcome to GLOB AI! 🔐</h3>
                        <p>Chat cleared! I'm ready for new questions.</p>
                        <p class="hint">Ask about cybersecurity or paste a URL to analyze.</p>
                    </div>
                    <span class="message-time">GLOB AI</span>
                </div>
            </div>
        `;
        chatMessages.innerHTML = welcomeHTML;
    });

    scanBtn.addEventListener('click', scanURL);

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            scanURL();
        }
    });

    // ===== Initialize =====
    initParticles();
    initVoiceRecognition();

    console.log('%c🔐 GLOB AI – Cybersecurity Assistant Initialized', 'color: #00f5ff; font-size: 14px; font-weight: bold;');
    console.log('%cDeveloped by Norang Lal', 'color: #7b2fff; font-size: 12px;');

})();
