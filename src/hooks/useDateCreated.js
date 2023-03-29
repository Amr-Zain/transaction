import React from "react";
function useDateCreated(dateCreated){
    const [createdText,setCeatedText] = React.useState();
        React.useEffect(()=>{
            function date(){
                const date = new Date();
                const createdAt =new Date(dateCreated);
                let period = (date.getTime() - createdAt.getTime())/1000;
                if(period<60){
                    setCeatedText('Just now');
                    return;
                }
                period /=60;
                if(Math.floor(period) >= 1 && period < 60){
                    setCeatedText( `${Math.floor(period)} m`);
                    return;
                }
                
                period /=60;
                if(Math.floor(period) >=1 && period< 24){
                    setCeatedText(`${Math.floor(period)} h`);
                    return;
                }
                period /=24;
                
                if(Math.floor(period) >=1 && period< 30){
                    setCeatedText(`${Math.floor(period)} d`);
                    return;
                }
                period /=30;
                if(Math.floor(period) >=1 && period<12){
                    setCeatedText(`${Math.floor(period)} m`);
                    return;
                }
                period /=12;
                if(period >=1){
                    period /=30;
                    setCeatedText(`${Math.floor(period)} y`);
                    return;
                }
                
            }
            date();
        },[]) 
        
        return createdText;
}
export default useDateCreated