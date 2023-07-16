import config from "./config.json";

export function formatAmount(amount,currency=false) {
    amount = (Math.round(amount * 100) / 100);
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (currency)
        return config.CURRENCY.SYMBOL + amount;
    else
        return amount;
  }


export function formatCallRate(profile,rate_type="audio") {
    let amount=0;
    let result="";
    try{ 
        if (rate_type=="video")
        {
            amount= profile.profile.rates.video_call;
            amount=amount<=0 ? config.RATES.VIDEO_CALL : amount;     
        }
        else {
            amount= profile.profile.rates.audio_call;
            amount=amount<=0 ? config.RATES.AUDIO_CALL : amount;  
        }
        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        result=config.CURRENCY.SYMBOL + amount;
    }
    catch(error){
        result=100;
        console.log("formatRate error ",error);
    }
    return config.CURRENCY.SYMBOL + amount;
   
  }