

function element(tag:string){
    return document.getElementById(tag);
}

function getMs():number{
    return performance.now();
}

function typeOf(e:any):string{
    return e.constructor.name;
}