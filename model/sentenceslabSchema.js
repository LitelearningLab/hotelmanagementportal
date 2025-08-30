const mongoose =require("mongoose")
 
const sentenceslabSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    userdata:{

    },
    companyid:{
        type:String,
        
    },
    batchid:{
        type:String
    },
    companydata:{},
    batchdata:{},
    listeningattempt:{
        type:Number,
        default:0
    },
    score:{
        type:Number,
        default:0
    },
    sentences:[],
    username:{
        type:String,
        required:true
    },
    practiceattempt:{
        type:Number,
        default:0
    }
       
    
},{
    timestamps:true
})

const sentencesLabReport=mongoose.model("sentenceslabreport",sentenceslabSchema)

module.exports=sentencesLabReport