import { Schema, model, Types } from "mongoose";
import InvoiceItemSchema from "./invoice-item.model";
import { InvoiceStatus, CurrencyCode } from "./invoice.types";

export interface IInvoice {
  business: Types.ObjectId;
  customer?: Types.ObjectId;
  invoiceNumber: string;
  status: InvoiceStatus;
  currency: CurrencyCode;

  items: typeof InvoiceItemSchema[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;

  issuedAt?: Date;
  dueAt?: Date;
  paidAt?: Date;

  branding: {
    logo?: string;
    primaryColor?: string;
  };

  createdBy: Types.ObjectId;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },

    invoiceNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.DRAFT
    },

    currency: {
      type: String,
      enum: Object.values(CurrencyCode),
      required: true
    },

    items: [InvoiceItemSchema],

    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,

    issuedAt: Date,
    dueAt: Date,
    paidAt: Date,

    branding: {
      logo: String,
      primaryColor: String
    },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

InvoiceSchema.index({ business: 1, invoiceNumber: 1 });

export default model<IInvoice>('Invoice', InvoiceSchema);