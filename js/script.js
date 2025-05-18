async function fetchJSON(_file){
    try {
        const res = await fetch(_file);
        if(!res.ok) throw new Error(`Couldn't fetch the file. Error ${res.status}`);
        return await res.json();
    } catch (err){
        handleFetchError(err);
    }
}

function handleFetchError(_err_msg){
    const err_field = document.createElement('section');
    err_field.classList.add('errorContainer');

    const err_header = document.createElement("p");
    err_header.appendChild(document.createTextNode(_err_msg));

    err_field.appendChild(err_header);
    document.querySelector('main').prepend(err_field);
}

function generateQuestion(_question){
    // question container
    const question_container = document.createElement('section');
    question_container.classList.add('questionContainer');

    // question_header
    const question_header = document.createElement('section');
    question_header.classList.add('questionHeaderContainer');
    // question_text
    const question_text = document.createElement('h2');
    question_text.appendChild(document.createTextNode(_question['content']))
    // question_text -> question_header
    question_header.appendChild(question_text);
    // question_header -> question_container
    question_container.appendChild(question_header);

    // question_image (if exists) -> question container
    if(_question['image'] != null){
        const question_image = document.createElement('img');
        question_image.classList.add('questionImage');
        question_image.src = _question['image'];
        question_container.appendChild(question_image);
    }

    // answer_button -> answer_container -> question_container
    const ans_con = document.createElement('section');
    ans_con.classList.add('answerContainer');
    _question['answers'].forEach(answer => {
        const ans_btn = document.createElement('button');
        ans_btn.classList.add('answerButton');
        ans_btn.classList.add('ansDefault');
        ans_btn.textContent = answer['value'];
        ans_btn.addEventListener('click', answerHandler, true);
        ans_con.appendChild(ans_btn);
    });
    question_container.appendChild(ans_con);

    // question_container -> main_container
    document.querySelector('main').appendChild(question_container);
}

function answerHandler(ev){
    if(ev.type == 'click' && !ev.target.disabled){
        const question_container_index = Array.prototype.indexOf.call(document.querySelector("main").children, ev.target.parentElement.parentElement);
        const isCorrect = Array();
        
        fetchJSON('./json/questions.json').then(_JSON => {
            const current_answer_index = Array.prototype.indexOf.call(ev.target.parentElement.children, ev.target);
            const current_question = _JSON['questions'][question_container_index];
            
            current_question['answers'].forEach(_ans => {
                isCorrect.push(_ans['correct']);
            });

            const current_answer = current_question['answers'][current_answer_index];

            Array.from(ev.target.parentElement.children).forEach((_ans, i) => {
                if(isCorrect[i]){
                    _ans.classList.replace('ansDefault', 'ansTrue');
                }
                _ans.classList.replace('ansDefault', 'ansDisabled');
                _ans.disabled = true;
            });

            if(!current_answer['correct']){
                ev.target.classList.replace('ansDisabled', 'ansFalse');
            }
        });
    }
}

fetchJSON('./json/questions.json').then(_JSON => {
    _JSON['questions'].forEach(question => {
        generateQuestion(question);
    });
})

// scroll back to top (on page load, after refreshing)
window.scrollTo(0,0);