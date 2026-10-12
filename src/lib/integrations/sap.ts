import { SapInvoicePayload } from '@/types/integrations';

export async function executeSapAction(
  action: string,
  payload: Record<string, any>
): Promise<Record<string, any>> {
  const ts = Date.now().toString().slice(-4);

  switch (action) {
    case 'ingest_invoice_ocr':
      return {
        status: 'OCR_EXTRACTION_SUCCESS',
        documentId: `SAP-OCR-DOC-99${ts}`,
        vendorName: payload.vendor || 'Apex Logistics & Freight Corp',
        invoiceNumber: payload.invoiceId || `INV-2026-9941`,
        billedAmountUsd: payload.totalAmount || 48500,
        currency: 'USD',
        taxConfidence: 99.4,
        paymentTerms: 'NET30',
        apiCallLatencyMs: 215,
      };

    case 'query_purchase_order':
      return {
        status: 'PO_RETRIEVED',
        poNumber: payload.poNumber || 'PO-88320',
        authorizedAmountUsd: 45300,
        varianceAmountUsd: 3200,
        varianceType: 'UNAPPROVED_FUEL_SURCHARGE',
        poLineItemsCount: 6,
        costCenter: 'CC-LOGISTICS-4001',
        budgetStatus: 'SUFFICIENT_WITH_APPROVAL',
        apiCallLatencyMs: 189,
      };

    case 'post_general_ledger_journal':
      return {
        status: 'GL_JOURNAL_POSTED',
        sapJournalDocNumber: `SAP-GL-2026-88${ts}`,
        glAccount: payload.glAccount || 'GL-20440-ACCOUNTS-PAYABLE',
        clearingStatus: 'SUSPENSE_CLEARED_POSTED',
        postedAmountUsd: payload.postedAmount || 48500,
        fiscalPeriod: '2026-09',
        soxReferenceNumber: `SOX-PROOF-${ts}`,
        apiCallLatencyMs: 240,
      };

    case 'create_purchase_order':
      return {
        status: 'PURCHASE_ORDER_COMMITTED',
        poNumber: `PO-CAPEX-2026-99${ts}`,
        vendorName: payload.vendor || 'Dell Enterprise Systems',
        committedAmountUsd: payload.amount || 284000,
        assetClass: 'CAPEX_AI_HARDWARE',
        accountingDocument: `DOC-ACC-400${ts}`,
        apiCallLatencyMs: 210,
      };

    default:
      return {
        status: 'SAP_OPERATION_COMPLETED',
        action,
        timestamp: new Date().toISOString(),
      };
  }
}
