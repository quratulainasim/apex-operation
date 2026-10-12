# Apex Operations - Complete Workflow Guide
## How to Start Workflows & Find Proof of Execution

---

## 📋 Table of Contents
1. [What is a Workflow?](#what-is-a-workflow)
2. [How to Start Workflows - 5 Different Ways](#how-to-start-workflows---5-different-ways)
3. [Workflow Verification & Proof System](#workflow-verification--proof-system)
4. [Where to Find Proof of Requests](#where-to-find-proof-of-requests)
5. [Audit Trail & Compliance](#audit-trail--compliance)
6. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 🎯 What is a Workflow?

A **workflow** is an automated sequence of steps that handles business requests without manual intervention. Think of it as a digital checklist that runs itself.

### Simple Example:
**Manual Process (Old Way):**
1. Customer requests refund
2. You check their account
3. You calculate refund amount
4. You get manager approval
5. You process refund in Stripe
6. You send confirmation email

**Automated Workflow (New Way):**
1. Customer requests refund
2. **Workflow automatically** checks account → calculates → gets approval → processes → sends email
3. You just monitor the progress

---

## 🚀 How to Start Workflows - 5 Different Ways

### **Method 1: AI Request Intake (Recommended for Beginners)**

**Best for:** Natural language requests, business users, first-time users

#### Step-by-Step:
1. **Navigate to AI Studio**
   - Go to: `http://localhost:3000/intake`
   - Or click "AI Request Studio" from home page

2. **Enter Your Request**
   - Type your request in plain English
   - Example: `"Customer John wants a $500 refund for cancelled subscription"`

3. **Configure Settings (Optional)**
   - **Source Channel**: Where request came from (Slack, Email, etc.)
   - **Context JSON**: Add extra metadata if needed

4. **Click "Classify & Synthesize DAG"**
   - AI analyzes your request
   - Shows structured analysis
   - Recommends appropriate workflow

5. **Review & Launch**
   - Check the AI analysis
   - Click "Launch Pipeline"
   - Workflow starts automatically

#### Example Requests to Try:
```
"Process $200 refund for customer Sarah"
"Security incident - need to revoke IAM access for user John"
"Invoice discrepancy - billed $5000 but PO shows $4500"
"Customer SLA breach - 4 hours downtime, need $15,000 credit"
```

---

### **Method 2: Instant Presets (Quickest Demo)**

**Best for:** Quick testing, demos, understanding the system

#### Step-by-Step:
1. **Go to Home Page**
   - Navigate to: `http://localhost:3000`

2. **Click Any Preset Button**
   - Look for "Instant Presets (1-Click)" section
   - Click any preset button (Customer SLA, Security Incident, etc.)

3. **Automatic Launch**
   - Workflow launches immediately
   - Redirects to execution page
   - No configuration needed

#### Available Presets:
- **Customer SLA Breach** - Enterprise customer outage scenario
- **Security Incident** - IAM access revocation scenario  
- **Invoice Discrepancy** - SAP invoice mismatch scenario

---

### **Method 3: Workflow Catalog (For Specific Templates)**

**Best for:** Choosing from pre-built workflows, business-specific tasks

#### Step-by-Step:
1. **Navigate to Catalog**
   - Go to: `http://localhost:3000/workflows`
   - Or click "Workflow Catalog" from home page

2. **Search & Filter**
   - Use search bar to find workflows
   - Filter by category (Customer Ops, Finance, Security, etc.)

3. **Browse Templates**
   - Each card shows workflow details
   - Check step count, SLA, success rate
   - See if human approval is required

4. **Launch Workflow**
   - Click "Launch" button on desired template
   - Creates new workflow instance
   - Redirects to execution page

#### Workflow Categories:
- **Customer Ops** - SLA breaches, refunds, escalations
- **Finance & ERP** - SAP invoices, reconciliation
- **Security & IAM** - Access revocation, incident response
- **Cloud & DevOps** - Infrastructure scaling, cost optimization
- **Procurement & IT** - General operational workflows

---

### **Method 4: Workflow Builder (For Custom Workflows)**

**Best for:** Creating custom workflows, specific business needs

#### Step-by-Step:
1. **Open Workflow Builder**
   - Go to: `http://localhost:3000/workflows/builder`
   - Or click "New Workflow Builder" from catalog

2. **Design Your Workflow**
   - **Add Nodes**: Click buttons in left panel to add steps
   - **Configure Nodes**: Click nodes in center to edit properties
   - **Connect Steps**: Nodes automatically connect in sequence

3. **Available Node Types:**
   - **Triggers**: Webhook intake, AI reasoning
   - **Integrations**: Salesforce, SAP, Jira, Stripe, AWS
   - **Human Gates**: Approval gates, notifications
   - **Logic**: Conditions, branching

4. **Configure Node Properties**
   - Edit node name and description
   - Set approval roles for human gates
   - Configure input payloads

5. **Deploy & Test**
   - Click "Deploy & Test Execution"
   - Workflow instance created
   - Redirects to execution page

---

### **Method 5: Direct API Integration (For Developers)**

**Best for:** System integration, automated triggering, external systems

#### Step-by-Step:
1. **Use the AI Analysis API**
   ```bash
   curl -X POST http://localhost:3000/api/ai/analyze \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Process $500 refund for customer John"}'
   ```

2. **Get Structured Analysis**
   - API returns JSON with workflow recommendation
   - Includes intent classification, risk assessment
   - Provides suggested workflow ID

3. **Launch Workflow Programmatically**
   - Use the workflow ID from analysis
   - Integrate with your existing systems
   - Automate workflow triggering

#### API Response Example:
```json
{
  "success": true,
  "data": {
    "requestId": "REQ-1234",
    "summary": "Customer refund request",
    "intentCategory": "CUSTOMER_SUPPORT",
    "recommendedWorkflowId": "WF-CUST-REFUND-01",
    "recommendedWorkflowTitle": "Standard Customer Refund Process"
  },
  "source": "GEMINI_2_5_FLASH"
}
```

---

## ✅ Workflow Verification & Proof System

### **How the System Verifies Your Request**

#### **1. AI Analysis (First Layer of Verification)**
- **Natural Language Processing**: AI understands your request
- **Entity Extraction**: Pulls out key information (names, amounts, dates)
- **Intent Classification**: Determines what type of request this is
- **Risk Assessment**: Evaluates risk level and approval requirements

#### **2. Rule Engine (Second Layer of Verification)**
- **Business Rules**: Checks against company policies
- **Amount Limits**: Verifies if amount requires approval
- **Authorization Levels**: Ensures proper authorization
- **SLA Requirements**: Checks service level agreement requirements

#### **3. Workflow Selection (Third Layer of Verification)**
- **Template Matching**: Selects appropriate workflow template
- **Step Validation**: Ensures all required steps are included
- **Integration Check**: Verifies required integrations are available
- **Compliance Verification**: Ensures regulatory compliance

#### **4. Execution Monitoring (Fourth Layer of Verification)**
- **Real-time Tracking**: Each step is monitored as it executes
- **Error Handling**: Automatic error detection and handling
- **Approval Gates**: Pauses for human approval when required
- **Compensation**: Automatic rollback if steps fail

### **Verification Example**

**Your Request:** `"Process $5000 refund for enterprise customer"`

**System Verification Process:**
```
1. AI Analysis:
   ✅ Understands: Refund request, $5000, enterprise customer
   ✅ Extracts: Amount, customer tier, request type

2. Rule Engine Check:
   ✅ Rule: Refunds > $1000 require VP approval
   ✅ Rule: Enterprise customers have enhanced SLA
   ✅ Decision: Requires human approval gate

3. Workflow Selection:
   ✅ Selects: "Enterprise Refund with Approval" workflow
   ✅ Includes: Account check → VP approval → Processing → Notification

4. Execution:
   ✅ Step 1: Account check - PASSED
   ⏸️ Step 2: VP approval - WAITING FOR HUMAN
   ⏸️ Step 3: Processing - PAUSED
   ⏸️ Step 4: Notification - PAUSED
```

---

## 🔍 Where to Find Proof of Requests

### **1. Real-Time Execution Monitoring**

**Location:** Workflow Execution Page
**URL:** `http://localhost:3000/workflows/[id]`

#### What You'll See:
- **Visual DAG Canvas**: Step-by-step execution progress
- **Color-Coded Status**:
  - 🔵 Blue = Currently running
  - 🟡 Amber = Waiting for approval
  - 🟢 Green = Completed successfully
  - 🔴 Red = Failed

#### How to Monitor:
1. **Watch the Canvas**: See nodes change color as they execute
2. **Check the Logs Tab**: Real-time execution logs
3. **View Payloads Tab**: Input/output data for each step
4. **Monitor State Tab**: Current workflow variables

---

### **2. Audit Log Page (Complete Proof Trail)**

**Location:** Audit Log Page
**URL:** `http://localhost:3000/audit`

#### What This Provides:
- **Complete Event History**: Every action ever taken
- **Cryptographic Proof**: SHA-256 hash chain for tamper evidence
- **Actor Tracking**: Who/what performed each action
- **Timestamp Records**: Exact time of each event
- **Payload Details**: Full data for each step

#### How to Access:
1. **Navigate to Audit Page**
   - Click "Audit" in sidebar
   - Or go to: `http://localhost:3000/audit`

2. **Search for Your Request**
   - Use search bar to find specific events
   - Filter by actor type (AI, Human, System, Integration)
   - Click expand button (↓) to see full details

3. **Export Proof**
   - Click "Export CSV" for spreadsheet format
   - Click "Export SOC2 JSON" for compliance format
   - Files include complete cryptographic proof

#### Audit Event Information:
```
✅ Timestamp: Exact time of event
✅ Actor Type: AI_AGENT, HUMAN_OPERATOR, SYSTEM_CORE, INTEGRATION_CONNECTOR
✅ Actor Name: Specific system or person who performed action
✅ Workflow ID: Which workflow this event belongs to
✅ Node ID: Which specific step in the workflow
✅ Event Summary: Human-readable description
✅ SHA-256 Hash: Cryptographic proof of event integrity
✅ Previous Hash: Links to previous event (chain of custody)
✅ Full Details: Complete payload and results
```

---

### **3. Activity Stream (Real-Time Events)**

**Location:** Home Page Dashboard
**URL:** `http://localhost:3000`

#### What This Shows:
- **Live Event Feed**: Real-time workflow events
- **Recent Activity**: Latest workflow executions
- **Status Updates**: Current state of running workflows
- **Quick Links**: Direct links to workflow details

#### How to Monitor:
1. **Check Home Page**: See live activity stream
2. **Click Events**: Jump to specific workflow details
3. **Watch Status**: See real-time status changes

---

### **4. Workflow Instance Details**

**Location:** Individual Workflow Pages
**URL:** `http://localhost:3000/workflows/[instance-id]`

#### What This Provides:
- **Execution History**: Complete timeline of workflow execution
- **Step-by-Step Details**: Results of each workflow step
- **Final State**: End result and outputs
- **Error Logs**: Any errors that occurred during execution

#### How to Access:
1. **From Audit Log**: Click workflow ID link
2. **From Activity Stream**: Click on any event
3. **From Catalog**: Click on running instances

---

## 🔐 Audit Trail & Compliance

### **Cryptographic Proof System**

The system uses **SHA-256 hashing** to create an immutable audit trail:

#### **How It Works:**
1. **Event Creation**: Every action creates an audit event
2. **Hash Calculation**: Event data is hashed using SHA-256
3. **Chain Formation**: Each event includes previous event's hash
4. **Tamper Detection**: Any modification breaks the hash chain

#### **Hash Chain Example:**
```
Event 1: Hash = abc123... (Previous: GENESIS_ROOT)
Event 2: Hash = def456... (Previous: abc123...)
Event 3: Hash = ghi789... (Previous: def456...)
Event 4: Hash = jkl012... (Previous: ghi789...)
```

If Event 2 is modified, its hash changes, breaking the chain from Event 3 onward.

### **Compliance Standards**

The audit system supports:
- **SOC2 Type II**: Cryptographic audit trail
- **ISO 27001**: Information security management
- **HIPAA**: Healthcare data protection
- **GDPR**: Data protection and privacy

### **Export Options**

#### **CSV Export:**
- Good for spreadsheet analysis
- Includes all event data
- Compatible with Excel, Google Sheets

#### **SOC2 JSON Export:**
- Compliance-ready format
- Includes cryptographic hashes
- Suitable for audits and regulators

---

## 🎯 Complete Workflow Example

### **Scenario: Customer Refund Request**

#### **Step 1: Start the Workflow**
```
Method: AI Request Intake
Request: "Process $500 refund for customer Sarah Johnson"
```

#### **Step 2: AI Analysis**
```
✅ Intent Classified: CUSTOMER_SUPPORT
✅ Amount Extracted: $500
✅ Customer: Sarah Johnson
✅ Risk Level: LOW
✅ Approval Required: NO (under $1000 limit)
✅ Recommended Workflow: WF-CUST-REFUND-01
```

#### **Step 3: Workflow Execution**
```
Step 1: Check Customer Account
  Status: ✅ COMPLETED
  Result: Account active, refund eligible

Step 2: Calculate Refund Amount  
  Status: ✅ COMPLETED
  Result: $500 validated

Step 3: Process Refund in Stripe
  Status: ✅ COMPLETED
  Result: Refund processed, transaction ID: txn_12345

Step 4: Send Confirmation Email
  Status: ✅ COMPLETED
  Result: Email sent to sarah@example.com

Workflow Status: SUCCESS
```

#### **Step 4: Verification & Proof**
```
✅ Real-time Monitoring: Watched execution on DAG canvas
✅ Audit Log Entry: All 4 steps recorded with timestamps
✅ Cryptographic Hash: Each event has SHA-256 hash
✅ Actor Tracking: AI Agent + Integration Connector recorded
✅ Export Available: Can export CSV/JSON for records
```

---

## ❓ Troubleshooting & FAQ

### **Q: I started a workflow but don't see it running**

**A: Check these locations:**
1. **Home Page**: Look at Activity Stream for recent events
2. **Audit Log**: Search for your workflow ID
3. **Workflow Execution Page**: Make sure you're on the correct instance URL

### **Q: How do I know if my request was actually processed?**

**A: Look for these proofs:**
1. **Audit Log Entry**: Your request should appear with timestamp
2. **SHA-256 Hash**: Each event has cryptographic proof
3. **Status Changes**: Workflow status should change from RUNNING to SUCCESS
4. **Integration Results**: Check payload data for actual system responses

### **Q: The workflow seems stuck on one step**

**A: Possible reasons:**
1. **Waiting for Approval**: Check if human approval is needed
2. **Integration Delay**: External system might be slow
3. **Error Condition**: Check Logs tab for error messages
4. **Network Issue**: Verify backend connectivity

### **Q: Can I export proof for compliance audits?**

**A: Yes, multiple options:**
1. **CSV Export**: For spreadsheet analysis
2. **SOC2 JSON Export**: For formal compliance
3. **Audit Log Print**: Direct from browser
4. **API Access**: Programmatic export options

### **Q: How long are audit logs kept?**

**A: Currently:**
- Logs are stored in browser memory
- Export to save permanently
- Future versions will include persistent storage

### **Q: Can I undo a completed workflow?**

**A: Limited options:**
1. **Compensation Workflows**: Some workflows have rollback steps
2. **Manual Intervention**: Contact affected systems directly
3. **New Workflow**: Create compensating workflow to reverse actions

---

## 📚 Quick Reference

### **Starting Workflows:**
- **Beginners**: Use AI Request Intake (`/intake`)
- **Quick Demo**: Use Instant Presets (Home page)
- **Specific Task**: Use Workflow Catalog (`/workflows`)
- **Custom Need**: Use Workflow Builder (`/workflows/builder`)
- **Integration**: Use API (`/api/ai/analyze`)

### **Finding Proof:**
- **Real-time**: Workflow Execution Page (`/workflows/[id]`)
- **Complete History**: Audit Log Page (`/audit`)
- **Live Events**: Activity Stream (Home page)
- **Export Data**: CSV/SOC2 JSON from Audit page

### **Monitoring Status:**
- **Visual Progress**: DAG canvas on execution page
- **Detailed Logs**: Logs tab on execution page
- **Data Flow**: Payloads tab on execution page
- **Event History**: Audit log page

---

## 🎓 Summary

### **Starting Workflows = 5 Methods:**
1. **AI Intake** - Natural language requests
2. **Instant Presets** - One-click demo scenarios
3. **Workflow Catalog** - Pre-built template selection
4. **Workflow Builder** - Custom workflow creation
5. **API Integration** - Programmatic triggering

### **Finding Proof = 4 Locations:**
1. **Execution Page** - Real-time monitoring
2. **Audit Log** - Complete cryptographic history
3. **Activity Stream** - Live event feed
4. **Export Files** - CSV/JSON for permanent records

### **Verification = 4 Layers:**
1. **AI Analysis** - Understanding and classification
2. **Rule Engine** - Business rule validation
3. **Workflow Selection** - Template matching
4. **Execution Monitoring** - Real-time tracking

The system provides complete transparency and cryptographic proof for every workflow execution, ensuring compliance and accountability for all automated business processes.

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-21  
**System:** Apex Operations v1.0.0