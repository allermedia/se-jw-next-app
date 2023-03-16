export const convertMinToSec = (timeInMin = '') => {
    if(!timeInMin?.length){
      return 0;
    }
  
    //If time is being input as 1:01, 1,01 or 1.01, it should work. 
    const formattedTimeInMin = timeInMin.replace(/[,|.|:]/g, ':');
  
    const timeList = formattedTimeInMin.split(':');
    
    let hours = '0', minutes = '0', seconds = '0';
  
    if(timeList.length === 3){
      [hours, minutes, seconds] = timeList;
    }else if(timeList.length === 2){
      [minutes, seconds] = timeList;
    }else{
      [seconds] = timeList;
    }
  
    //Restrict to 2 digits for sec.
    seconds = (seconds || '0').slice(0,2);
  
    return (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
  }
  