const mongoose=require("mongoose")

const pronunciationlabSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true,

    },
    userData:{},
    companyid:{
        type:String,
        required:true
    },
    companydata:{},
    listeningattempt:{
        type:Number,
        default:0
    },
    // numberofword:{
    //     type:Number,
    //     default:0
    // },
    practiceattempt:{
        type:Number,
        default:0
    },
    correctattempt:{
        type:Number,
        default:0
    },
    batchid:{
        type:String,
        
    },
    username:{
        type:String,
        required:true
    },
    batchdata:{},
    words:[]

},
{
    timestamps:true,
})

const pronunciatonLabReport=mongoose.model("pronunciatonlabrepots",pronunciationlabSchema)
module.exports=pronunciatonLabReport