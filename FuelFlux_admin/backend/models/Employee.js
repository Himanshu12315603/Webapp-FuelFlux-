import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    shift: {
        type: String,
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PetrolPump',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Employee', employeeSchema);
