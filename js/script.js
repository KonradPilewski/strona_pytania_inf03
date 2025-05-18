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
        let answers = Array();
        fetchJSON('./json/questions.json').then(questions => {
            questions.forEach(question => {
                if(question['id'] == ev.target.parentElement.parentElement.id){
                    question['answers'].forEach(answer => {
                        answers.push(answer['correct']);
                    });

                    question['answers'].forEach(answer => {
                        if(answer['id'] == ev.target.id){
                            Array.from(ev.target.parentElement.childNodes).forEach(_ans => {
                                _ans.classList.replace('ansDefault', 'ansDisabled');
                                _ans.disabled = true;
                            });
                            if(!answer['correct']){
                                ev.target.classList.replace('ansDisabled', 'ansFalse');
                            }
                        }
                    })
                    Array.from(ev.target.parentElement.childNodes)[answers.findIndex(x => x == true)].classList.replace('ansDisabled', 'ansTrue');
                }
            })
        })
    }
}

fetchJSON('./json/questions.json').then(questions => {
    questions.forEach(question => {
        generateQuestion(question);
    });
})

// scroll back to top (on page load, after refreshing)
window.scrollTo(0,0);