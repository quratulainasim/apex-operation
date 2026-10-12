# FlowOps - Live Demo Script
## Step-by-Step Exhibition Demo Guide

---

## 🎯 Demo Preparation (Before Exhibition)

### **System Setup:**
- [ ] Ensure FlowOps is running on http://localhost:3000
- [ ] Test all demo scenarios work correctly
- [ ] Verify audit log export functionality
- [ ] Check all integrations are connected
- [ ] Prepare backup scenarios in case of technical issues

### **Demo Environment:**
- [ ] Clean browser (no extra tabs)
- [ ] Good internet connection
- [ ] Audio setup if presenting to group
- [ ] Backup device (tablet/laptop) ready
- [ ] Printed quick reference guide

---

## 🎮 Demo Script (5-7 Minutes Total)

### **INTRODUCTION (1 Minute)**

**Speaker:**
"Welcome! I'm going to show you how FlowOps transforms manual business processes into automated workflows. Let me start with a question: How long does it take your team to process a customer refund request?"

**[Pause for response]**

"Typically, it involves checking customer accounts, calculating amounts, getting approvals, processing payments, and sending confirmations. That's 5 people, 3 systems, and 2-3 days of work. Let me show you how FlowOps does this in under 2 minutes."

---

### **SCENARIO 1: CUSTOMER REFUND (2 Minutes)**

#### **Step 1: Navigate to AI Request Studio (15 seconds)**
**Action:** Click "AI Request Studio" from home page or go to http://localhost:3000/intake

**Speaker:**
"I'll start in our AI Request Studio. This is where you simply type what you need in plain English."

#### **Step 2: Enter Customer Refund Request (30 seconds)**
**Action:** Type in the text area:
```
"Enterprise customer Acme Corp ($420K ARR) experienced a 4-hour production outage. VP John Miller is requesting a 25% SLA breach service credit of $15,000 USD on Stripe, plus urgent Jira escalation to DevOps with Slack leadership notification."
```

**Speaker:**
"I'm typing this exactly as it might come in as an email or ticket. Notice this is complex—it involves customer tier calculation, SLA verification, financial approval, payment processing, and notifications across multiple systems."

#### **Step 3: AI Analysis (30 seconds)**
**Action:** Click "Classify & Synthesize DAG" button

**Speaker:**
"Watch this—FlowOps analyzes my request in real-time. It extracts key information: customer Acme Corp, $420K ARR, 4-hour outage, $15,000 credit request. It classifies this as a high-priority customer support issue with financial impact. It determines that CFO approval is required because the amount exceeds $10,000. And it recommends the appropriate workflow automatically."

#### **Step 4: Review AI Analysis (15 seconds)**
**Action:** Point to the analysis results showing on screen

**Speaker:**
"Look at this structured analysis. FlowOps understood the urgency level, the risk assessment, the recommended workflow, and even extracted specific entities like the customer tier and approval requirements. This normally requires a human to read and interpret—FlowOps does it instantly."

#### **Step 5: Launch Workflow (15 seconds)**
**Action:** Click "Launch Pipeline" button

**Speaker:**
"I'll launch this workflow now and watch how it executes automatically."

---

### **SCENARIO 1: WORKFLOW EXECUTION (2 Minutes)**

#### **Step 6: Monitor Real-Time Execution (45 seconds)**
**Action:** Watch the DAG canvas as nodes change color

**Speaker:**
"This visual canvas shows each step in the workflow. Watch these nodes—they're turning blue as they execute, green when complete. See, it's checking the customer account status... verifying the SLA breach duration... calculating the appropriate credit amount... and now it's paused."

#### **Step 7: Human Approval Gate (30 seconds)**
**Action:** Point to the amber "Human Authorization Gate" button when it appears

**Speaker:**
"It paused because this requires CFO approval for amounts over $10,000. This is a human-in-the-loop gate—critical decisions always require people. I'll approve this now."

**Action:** Click the amber "Human Authorization Gate" button

#### **Step 8: Continue Execution (30 seconds)**
**Action:** Watch remaining nodes complete

**Speaker:**
"Once approved, FlowOps continues automatically: processing the $15,000 credit in Stripe, creating the Jira escalation ticket, sending the Slack notification to leadership, and recording everything. Done in under 2 minutes."

#### **Step 9: Check Logs and Payloads (15 seconds)**
**Action:** Click on "Logs" tab and "Payloads" tab in the right panel

**Speaker:**
"I can see exactly what happened at each step. The logs show the execution timeline, and the payloads show the actual data that was processed. Complete transparency."

---

### **SCENARIO 2: SECURITY INCIDENT (1.5 Minutes)**

#### **Step 10: Quick Security Demo (45 seconds)**
**Action:** Go back to AI Request Studio, type:
```
"Security incident detected: Anomalous IAM credential export from unregistered IP 194.26.29.11 affecting user external-contractor-92@partner.domain with production admin access. Need immediate IAM revocation and security team notification."
```

**Speaker:**
"Let me show you a different scenario—security incidents. I'll type this security alert and watch how FlowOps handles urgent situations differently."

**Action:** Click "Classify & Synthesize DAG"

**Speaker:**
"FlowOps immediately recognizes this as a critical security incident. It prioritizes it as urgent, identifies the risk level as critical, and selects the emergency IAM revocation workflow."

**Action:** Click "Launch Pipeline"

**Speaker:**
"Security workflows execute faster because of the urgency. Watch—it's already checking the IAM status, identifying the affected roles, and preparing the revocation."

#### **Step 11: Show Audit Trail (30 seconds)**
**Action:** Navigate to Audit Log page (http://localhost:3000/audit)

**Speaker:**
"Every single action is recorded here in our audit log. See these entries? Each has a timestamp, who performed the action, what system was used, and a cryptographic hash for security. This is your complete compliance record."

#### **Step 12: Export Compliance Report (15 seconds)**
**Action:** Click "Export SOC2 JSON" button

**Speaker:**
"One click and I can export this entire audit trail for compliance reporting. SOC2, ISO 27001, HIPAA—we support all major compliance standards out of the box."

---

### **CLOSING (1 Minute)**

#### **Step 13: Business Value Summary (30 seconds)**
**Speaker:**
"What you just saw took us under 4 minutes total. The customer refund scenario normally takes 2-3 days with 5 people coordinating across 3 systems. The security incident normally requires manual verification across multiple security tools. FlowOps handled both automatically, with complete compliance and audit trails."

#### **Step 14: Implementation Overview (15 seconds)**
**Speaker:**
"Implementation is fast—we integrate with your existing systems (Salesforce, SAP, Jira, Stripe, AWS), configure your business rules and approval processes, and you're live in 2-4 weeks. No technical training required—your team just types in plain English."

#### **Step 15: Call to Action (15 seconds)**
**Speaker:**
"Which of your workflows would you like to see FlowOps handle? We can set up a pilot program with your actual scenarios and show you the time and cost savings specifically for your business."

---

## 🎯 Alternative Demo Scenarios

### **If Client is Finance-Focused:**
**Invoice Processing Demo:**
```
"Invoice INV-2026-9941 from Apex Logistics billed $48,500 but our PO-88320 shows $45,300. Need to investigate the $3,200 discrepancy before payment can be processed."
```

**Key Points to Highlight:**
- Automatic discrepancy detection
- ERP integration (SAP)
- Financial approval workflows
- Audit trail for compliance

### **If Client is IT/Operations-Focused:**
**Infrastructure Scaling Demo:**
```
"Production cluster us-east-1-prod-compute-mesh is at 94.2% CPU utilization. Need to scale from 12 to 16 nodes using c6i.4xlarge instances. Projected monthly cost increase is $4,200."
```

**Key Points to Highlight:**
- Cloud integration (AWS)
- Cost optimization
- Automated scaling
- Budget approval workflows

### **If Client is Customer Support-Focused:**
**Customer Escalation Demo:**
```
"Enterprise customer Acme Global (Platinum tier) has been waiting 48 hours for critical issue #12345. Need immediate escalation to VP Support and SLA breach investigation."
```

**Key Points to Highlight:**
- CRM integration (Salesforce)
- SLA management
- Escalation workflows
- Customer satisfaction focus

---

## ⚠️ Troubleshooting Demo Issues

### **If AI Analysis Fails:**
**Backup Plan:** Use a preset scenario from the home page
**Script:** "Let me show you a pre-configured scenario that demonstrates the same capabilities."

### **If Workflow Gets Stuck:**
**Backup Plan:** Reset the workflow and try again
**Script:** "Let me reset this and show you the execution flow with a fresh start."

### **If System is Slow:**
**Backup Plan:** Focus on the AI analysis and audit trail
**Script:** "While that processes, let me show you the audit compliance features which are equally important."

### **If Integration Fails:**
**Backup Plan:** Use offline fallback mode
**Script:** "FlowOps has built-in fallback capabilities. Let me show you how it handles this with our deterministic engine."

---

## 🎤 Demo Tips for Success

### **Before the Demo:**
1. **Practice each scenario** at least 3 times
2. **Have 2-3 backup scenarios** ready
3. **Test on the actual network** you'll use during exhibition
4. **Keep the browser clean** - no extra tabs or bookmarks
5. **Have printed materials** ready as handouts

### **During the Demo:**
1. **Speak slowly and clearly** - don't rush
2. **Point to screen elements** as you mention them
3. **Pause for questions** between scenarios
4. **Focus on business value** - not technical details
5. **Keep eye contact** with the audience, not just the screen

### **After the Demo:**
1. **Ask for their specific use case**
2. **Offer to customize a demo** for their needs
3. **Provide next steps clearly**
4. **Exchange contact information**
5. **Follow up within 24 hours**

---

## 📋 Quick Demo Checklist

### **Technical Readiness:**
- [ ] FlowOps system running smoothly
- [ ] All demo scenarios tested and working
- [ ] Audit log export functionality verified
- [ ] Browser cache cleared and optimized
- [ ] Backup device ready

### **Content Readiness:**
- [ ] Demo script practiced and memorized
- [ ] Backup scenarios prepared
- [ ] ROI calculator available
- [ ] Client-specific research done
- [ ] Questions anticipated and answered

### **Materials Ready:**
- [ ] Business cards
- [ ] Product one-pager
- [ ] Case studies (if available)
- [ ] Contact form/sign-up sheet
- [ ] Giveaway items (if applicable)

---

## 🎯 Demo Success Metrics

### **Good Demo Indicators:**
- Client asks specific questions about their use case
- Client requests follow-up meeting
- Client wants to see their specific scenario
- Client asks about pricing/timeline
- Client takes business card/materials

### **Areas for Improvement:**
- Client seems confused or disengaged
- Too many technical details
- Demo feels too scripted
- System performance issues
- Clear objections not addressed

---

**Remember:** The goal is not to show every feature, but to demonstrate the core value proposition in a way that's relevant to the client's specific business needs.

**Good luck with your exhibition!**