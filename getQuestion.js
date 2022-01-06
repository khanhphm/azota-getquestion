var tokenAuthDefault = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwNjk2MjU1IiwiZnVsbF9uYW1lIjoiPyrwnZGI8J2Rm_CdkZjwnZGb8J2RnPCdkaTwnZGb8J2RgfCdkY7wnZGa8J2RkiDwnZ-x8J2frPCdn60gLSDwnZGH4oSO8J2RlvCdkaAg8J2RlvCdkaAg8J2RjvCdkZsg8J2RkvCdkZ_wnZGf8J2RnPCdkZ8g8J2RpOKEjvCdkZbwnZGZ8J2RkiDwnZGU8J2RkvCdkaHwnZGh8J2RlvCdkZvwnZGUIPCdkaDwnZGh8J2RovCdkZHwnZGS8J2Rm_CdkaEg8J2RlvCdkZvwnZin8J2RnPCdkZ_wnZGa8J2RjvCdkaHwnZGW8J2RnPCdkZsgIiwiZW1haWwiOiIiLCJwaG9uZSI6IjMwMDQxOTc1MDAiLCJhdmF0YXIiOiJodHRwczovL3dld2lpbi5ueWMzLmNkbi5kaWdpdGFsb2NlYW5zcGFjZXMuY29tL2F2YXRhci9tMTFfMjAyMS9kMTAvMzA2OTYyNTUvNDgzZjdkMDk1M2NjZDkxOGU1Njk4N2ZlZGQwZjJjN2ZfNjFmNmM1M2U2YzNjNDEyZmE2ZTU3ODJjNzE4NTdiMmUxNjM2NTMwOTI2LmpwZWciLCJ6YWxvX2lkIjoiIiwicm9sZXMiOiJ7XCIkaWRcIjpcIjFcIixcIlBBUkVOVFwiOjEsXCJTVFVERU5UXCI6MX0iLCJsYXN0X2FjdGl2aXR5IjoiMjAyMS0xMS0xNiAxMjo1OToyMSIsIm5iZiI6MTYzNzA0MjM2MSwiZXhwIjoxNjY4MTQ2MzYxLCJpYXQiOjE2MzcwNDIzNjF9._9Zyiq10ks2LiXl9dcjLh2NYH1NgjmmX01JhJfF6Z5M";

function onClickGetQuestion(e) {
    form.style.display = "none";
    if (canGo(getUrl(input_url))) {
        var fullUrl = designUrl(getUrl(input_url));
        var id = getIdFromUrl(fullUrl);

        sendRequest(id);
    } else {
        
        backToDefaultHome();
    }
}

function sendRequest(id, tokenAuth = tokenAuthDefault, fullUserObj) {
    var url = `https://azota.vn/api/FrontExam/GetObj?HashId=${id}&password=${getPwd(input_password)}&hasInfo=1`;
    var Result;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Authorization", `Bearer ${tokenAuth}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            Result = JSON.parse(xhr.responseText);
            HandleResult(Result, fullUserObj);
        }
    };

    xhr.send();
}

function HandleResult(Result, fullUserObj) {
    console.log(Result)
    var Error;
    Error = checkError(Result, fullUserObj);
    if (Error == "ok") {
        
        var ListImage = getListImage(Result);
        RenderToView(ListImage, Result);
    } else {
        switch (Error) {
            case "pwd_err":
                
                backToDefaultHome();
                break;

            case "take_once":
                console.log("Starting-Create Account - Error Take Once")
                sendCreateAccount();
                break;
            case "outside_class":
                console.log("Outside ClassRoom")
                break;
            case "s_timing_err":
                
                backToDefaultHome();
                break;
            case "b_timing_err":
                
                backToDefaultHome();
                break;
            default:
               
                backToDefaultHome();
                break;
        }
    }
}

function getListImage(Result) {
    var ExamObj = Result.data.questionObjs;
    var ListImage = [];
    for (var Data of ExamObj) {
        ListImage.push(JSON.parse(Data.questionContent)[0].path)
    }

    return ListImage;
}

function RenderToView(ListImage, Result) {
    if (ListImage[0]) {

        question_viewer.style.display = "block";
        for (var img of ListImage) {
            var element = document.createElement("input");
            element.setAttribute("type", "image");
            element.setAttribute("src", img);
            element.style.maxWidth = "100%";
            element.style.height = "auto";
            question_viewer.appendChild(element);
        }
    } else {
        // There is no image link
        RenderToViewWithQuestionText(GetQuestionText(Result));
    }
}

function RenderToViewWithQuestionText(ListQuestionAndAnswer) {

    question_viewer.style.display = "block";
    for (var i = 0; i <= ListQuestionAndAnswer.length; i++) {
        let questionObj = ListQuestionAndAnswer[i];
        let answerObj = questionObj.questionAnswer;
        let element = document.createElement("div");
        let answer = document.createElement("div");

        element.style.fontWeight = "bold";
        element.style.padding = "5px";
        element.innerHTML = `Câu ${i + 1} : ${questionObj.questionText}`;

        answer.innerHTML = `${answerObj[0].key}. ${answerObj[0].content} \n 
        ${answerObj[1].key}. ${answerObj[1].content} \n
        ${answerObj[2].key}. ${answerObj[3].content} \n
        ${answerObj[3].key}. ${answerObj[3].content}`
        answer.style.padding = "5px";
        question_viewer.appendChild(element);
        question_viewer.appendChild(answer);
    }
}

function GetQuestionText(Result) {
    var ListQuestion = Result.data.questionObjs;
    var ListQuestionText = [];
    for (var question of ListQuestion) {
        var questionText = JSON.parse(question.questionContent)[0].content;
        var questionAnswer = JSON.parse(question.answerConfig);
        ListQuestionText.push({
            questionText,
            questionAnswer
        });
    }

    return ListQuestionText;
}

//checkError
function checkError(Result, fullUserObj = null) {
    switch (Result.data.errorMessage) {
        case "lang_core_exam_password_invalid":
            return "pwd_err";
            break;
        case "lang_core_you_just_can_take_one_once_time":
            return "take_once";
            break;
        case "lang_core_must_in_classroom":
            if (fullUserObj) {
                getIntoClass(fullUserObj?.rememberToken, Result);
            } else {
                getIntoClass(tokenAuthDefault, Result);
            }
            return "outside_class";
            break;
        case "lang_core_time_smaller_than_start_time":
            return "s_timing_err";
            break;
        case "lang_core_time_bigger_than_end_time":
            return "b_timing_err"
            break;
        default:
            break;
    }

    return "ok";
}



function backToDefaultHome() {
    form.style.display = "flex";

}