let content = document.querySelector('.content');
let list = document.querySelector('.list');
let submit = document.querySelector('.submit');

//新增
submit.addEventListener('click',function(e){
    let newtodo = content.value;
    let xhr = new XMLHttpRequest();
    xhr.open('post','/addTodo');
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify({'content':newtodo}));
    xhr.onload = function(){
        let resdata = JSON.parse(xhr.responseText) ;
        if(resdata.success == false){
            alert('fail to response');
            return;
        }
        console.log(resdata);
        let data = resdata.result
        let str = '';
        for(item in data){
            str += 
            `
            <li >${data[item].content}<input type="button" value="delete" class="delete" data-id="${item}"></li>
            `
            ;
        }
        list.innerHTML = str;     
    }  
})


//刪除
list.addEventListener('click',function(e){
    if(e.target.nodeName !== 'INPUT'){return};
    let key = e.target.dataset.id;
    // console.log(key,e.target.dataset.id);
    let xhr = new XMLHttpRequest();
    xhr.open('post','/removeTodo');
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify({'id':key}));
    xhr.onload = function(){
        let deledata = JSON.parse(xhr.responseText) ; 
        if(!deledata.success){alert('刪除失敗');}
        let str = '';
        let data = deledata.result
        console.log(data);
        for(item in data){
            str += 
            `
            <li >${data[item].content}<input type="button" value="delete" class="delete" data-id="${item}"></li>
            `
            ;
        }list.innerHTML = str; 
    }
})