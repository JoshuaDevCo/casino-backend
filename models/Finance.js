var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactions_schema = new Schema({
    id: { type: String, default: "" },
    fromId: { type: String, default: "" },
    fromName: { type: String, default: "" },
    toId: { type: String, default: "" },
    toName: { type: String, default: "" },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    fromLastBalance: { type: Number, required: true },
    fromUpdatedBalance: { type: Number, required: true },
    toLastBalance: { type: Number, required: true },
    toUpdatedBalance: { type: Number, required: true },
    status: { type: String, default: "success" },
    commission: {  type: Number, default: 0  },
    currency:{  type: String, default: "USD" },
    description: { type: String, default: "" }
},{ 
    timestamps: { createdAt: 'date' }
});

exports.Transactions = mongoose.model('transactions', transactions_schema);