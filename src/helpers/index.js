const quickSort=(arr)=>{
    
    if(arr.length<=1){
        return arr
    }
    let pivot=arr[0]
    let leftArr=[]
    let rightArr=[]
    
    for (let i = 1; i < arr.length; i++) {
        const element = arr[i];
        if(new Date(element.created_at)>new Date(pivot.created_at)){
            leftArr.push(element)
        }else{
            rightArr.push(element)
        }
        
    }

  return [...quickSort(leftArr),pivot,...quickSort(rightArr)]
    
}
module.exports={
    quickSort
}