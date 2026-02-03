/* global CN_UI */
(function () {
  const LS_KEY = "cn.gdpr.accepted.v1";
  const accepted = localStorage.getItem(LS_KEY) === "1";
  if (accepted) return;

  const modal = document.createElement("div");
  modal.className = "gdpr-modal is-open";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "GDPR notice");

  modal.innerHTML = `
    <div class="gdpr-modal__overlay" aria-hidden="true"></div>
    <div class="gdpr-modal__panel">
      <h3 class="gdpr-modal__title">Privacy Policy & Cookie Notice (GDPR)</h3>
      <div class="gdpr-modal__body">
        <p class="gdpr-modal__updated"><strong>Privacy Policy & Cookie Notice - cleannest.es</strong><br/>Last updated: 2026-02-03</p>
        <p>
          This Privacy Policy explains how Cleannest ("we", "us", "our") processes personal data in connection
          with cleannest.es (the "Website"). The Website includes a public contact form and a login-protected
          area used to store property-related records.
        </p>

        <h4>1) Who is responsible for your data</h4>
        <p>The Data Controller is Cleannest (see the Identification & Contact Details section at the end of this document).</p>
        <p>General contact email: info@cleannest.es</p>

        <h4>2) What personal data we process</h4>
        <h5>A) Contact form (public area)</h5>
        <p>When you contact us, we may process:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number (if you provide it)</li>
          <li>Message content and any information you include</li>
          <li>Technical metadata for security and delivery (e.g., date/time, IP address, basic server logs)</li>
        </ul>

        <h5>B) Account and login data (private area)</h5>
        <p>To provide access to the login-protected area, we may process:</p>
        <ul>
          <li>Username / account identifier</li>
          <li>Password (stored in hashed form; we do not store passwords in plain text)</li>
          <li>Login/security records (e.g., timestamps, IP address, failed login attempts)</li>
        </ul>

        <h5>C) Property and contact records (private area)</h5>
        <p>In the login-protected area, authorized users may store:</p>
        <ul>
          <li>Property addresses</li>
          <li>Names and contact details (e.g., email address, phone number)</li>
          <li>Notes related to properties/contacts (as entered by the authorized user)</li>
        </ul>

        <h5>D) Technical data (server logs)</h5>
        <p>
          Our hosting and security infrastructure may automatically process standard logs (IP address,
          device/browser information, timestamps, requested pages) for security and troubleshooting.
        </p>
        <p><em>Please do not submit or store special category data (e.g., health data, political opinions) unless strictly necessary and you have a valid lawful basis and appropriate safeguards.</em></p>

        <h4>3) Why we process personal data (purposes) and legal bases</h4>
        <h5>3.1 Responding to inquiries (contact form)</h5>
        <p><strong>Purpose:</strong> Receive, review, and respond to your message.</p>
        <p><strong>Legal basis:</strong> Legitimate interests (handling incoming requests and communicating with people who contact us).</p>
        <p><strong>Data used:</strong> Contact form data and relevant technical metadata.</p>

        <h5>3.2 Operating the login-protected area</h5>
        <p><strong>Purpose:</strong> Authenticate users, provide access to the private area, and keep the Website secure.</p>
        <p><strong>Legal basis:</strong> Legitimate interests (service operation and security) and/or performance of a contract (if access is provided under an agreement).</p>
        <p><strong>Data used:</strong> Account/login data and technical data.</p>

        <h5>3.3 Storing and managing property/contact records (private area)</h5>
        <p><strong>Purpose:</strong> Maintain and organize property-related records and associated contact details in the private area.</p>
        <p><strong>Legal basis:</strong> Legitimate interests (maintaining an internal record system for property-related administration) and/or performance of a contract (where records relate to an existing contractual relationship).</p>
        <p><strong>Data used:</strong> Property and contact records.</p>

        <h5>3.4 Security, abuse prevention, and incident handling</h5>
        <p><strong>Purpose:</strong> Detect, prevent, and investigate misuse, unauthorized access, and technical incidents.</p>
        <p><strong>Legal basis:</strong> Legitimate interests (protecting the Website and data).</p>
        <p><strong>Data used:</strong> Technical data and security logs.</p>

        <h4>4) Where the data comes from</h4>
        <ul>
          <li>Directly from you when you submit the contact form or communicate with us.</li>
          <li>From authorized users when they create or edit records in the private area.</li>
          <li>From third parties/public sources if an authorized user adds contact details based on a listing, referral, or other source.</li>
        </ul>
        <p><strong>If you are a person whose details are stored in the private area:</strong> If we hold your contact details but did not collect them directly from you (e.g., from a public listing or referral), we process them only for property-related communication/administration. Where required, we will provide this information at the latest when we first contact you, unless a legal exception applies.</p>

        <h4>5) Who we share data with (service providers / processors)</h4>
        <p>We do not sell personal data.</p>
        <p>We may share personal data with service providers that help us operate the Website (processors). Depending on configuration, these may include:</p>
        <ul>
          <li>Cloudflare (DNS/CDN, security and performance services)</li>
          <li>Supabase (backend services such as database/authentication/storage, depending on setup)</li>
          <li>GoDaddy (domain registration and/or hosting-related services, depending on setup)</li>
          <li>Resend (transactional email delivery, depending on setup)</li>
          <li>Titan Mail (mailbox/email hosting, depending on setup)</li>
        </ul>
        <p><strong>IT development, maintenance & operations provider (admin access):</strong> We use an external IT development/operations provider located in the EEA (see the Identification & Contact Details section at the end). This provider may access personal data only as necessary to provide support, maintenance, troubleshooting, and development, under confidentiality obligations and an appropriate data processing agreement.</p>
        <p>All providers process personal data only under our instructions and with appropriate safeguards.</p>

        <h4>6) International data transfers</h4>
        <p>We aim to keep personal data within the European Economic Area (EEA). If any service provider processes data outside the EEA, we will ensure appropriate safeguards are in place (for example, Standard Contractual Clauses or another lawful transfer mechanism), where required.</p>

        <h4>7) Data retention (how long we keep data)</h4>
        <p>We keep personal data only as long as necessary for the purposes described above:</p>
        <ul>
          <li>Contact form messages: up to 12 months after the last communication, unless longer retention is needed to handle disputes or comply with legal obligations.</li>
          <li>Account/login data: for as long as the account is active; typically up to 30 days after deletion for security/audit purposes (unless needed longer for incident investigation).</li>
          <li>Property/contact records (private area): retained until deleted by the authorized user or until the account is removed, unless retention is required for legal reasons.</li>
          <li>Server and security logs: typically 90 days, unless needed longer to investigate security incidents.</li>
        </ul>

        <h4>8) Security</h4>
        <p>We use reasonable technical and organizational measures to protect personal data, including:</p>
        <ul>
          <li>Access controls and authentication (login required for the private area)</li>
          <li>Password hashing (no plain-text password storage)</li>
          <li>Encryption in transit (HTTPS/TLS)</li>
          <li>Logging and monitoring to detect misuse</li>
          <li>Regular updates and maintenance</li>
        </ul>
        <p>Administrative access to the Website and database is restricted to the Controller and the Controller's authorized IT development/maintenance provider, on a need-to-know basis.</p>
        <p>No online service can be guaranteed 100% secure, but we work to reduce risks and respond to incidents appropriately.</p>

        <h4>9) Your rights</h4>
        <p>Depending on applicable law, you may have the right to:</p>
        <ul>
          <li>Request access to your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Request restriction of processing</li>
          <li>Object to processing based on legitimate interests</li>
          <li>Request data portability (in certain cases)</li>
          <li>Withdraw consent (only where processing is based on consent)</li>
        </ul>
        <p>To exercise your rights, contact us at: info@cleannest.es</p>

        <h4>10) Complaints</h4>
        <p>You have the right to lodge a complaint with your local supervisory authority. If you are in Spain, you can contact: Agencia Espanola de Proteccion de Datos (AEPD).</p>

        <h4>11) Cookies & similar technologies</h4>
        <h5>11.1 Essential cookies</h5>
        <p>We use essential cookies required for the Website to function, including:</p>
        <ul>
          <li>session/authentication cookies to keep you logged in to the private area</li>
          <li>security-related cookies/features used to protect the Website and prevent abuse</li>
        </ul>
        <p>Essential cookies are necessary to provide the service and are generally used because they are strictly necessary and/or on the basis of legitimate interests in operating a secure service.</p>

        <h5>11.2 Non-essential cookies (analytics/marketing)</h5>
        <p>We do not intentionally use analytics or marketing cookies unless explicitly enabled. If we introduce non-essential cookies (e.g., analytics) in the future, we will provide clear information and request consent where required.</p>

        <h4>12) Changes to this Privacy Policy</h4>
        <p>We may update this Privacy Policy from time to time. The "Last updated" date above shows when it was most recently revised.</p>

        <h4>Short Contact Form Privacy Notice (place under the "Send" button)</h4>
        <p>By submitting this form, you acknowledge that we will process your personal data to respond to your inquiry, as described in our Privacy Policy.</p>

        <h4>Identification & Contact Details (names at the end)</h4>
        <p><strong>Data Controller</strong></p>
        <p>Cleannest<br/>Owner / legal representative: Jozsef Bocs<br/>Email: info@cleannest.es<br/>Address: 35240 Carrizal, Pedro Perdomo Acedo 30, Gran Canaria</p>

        <p><strong>IT Development, Maintenance & Operations Provider (Processor)</strong></p>
        <p>Name: Balazs Turcsi<br/>Location: Hungary (EEA)<br/>Role: Website development, maintenance, and technical operations, with administrative access as necessary for support and maintenance under a data processing agreement.</p>
      </div>
      <div class="gdpr-modal__fine">By clicking OK you confirm you have read this notice.</div>
      <div class="gdpr-modal__actions">
        <button class="btn btn-primary" id="gdprAcceptBtn" type="button">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add("gdpr-no-scroll");

  const acceptBtn = modal.querySelector("#gdprAcceptBtn");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem(LS_KEY, "1");
      modal.remove();
      document.body.classList.remove("gdpr-no-scroll");
    });
  }
})();
