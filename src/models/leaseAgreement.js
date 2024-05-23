import mongoose from "mongoose";

const leaseAgreementSchema = new mongoose.Schema({
    land: {
        type: Schema.Types.ObjectId,
        ref: 'Land',
        required: true
    },
    lessor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    signedAt: {
        type: Date,
        default: Date.now
    }
});

const LeaseAgreement = mongoose.model('LeaseAgreement', leaseAgreementSchema);

export default LeaseAgreement;
