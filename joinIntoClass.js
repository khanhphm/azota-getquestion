var classRoomObjsLength = 1;
var countClassRoomIn = 0;

function getClassRoomsId(classRoomObjs) {
    var id = classRoomObjs[countClassRoomIn].id;
    countClassRoomIn++;
    return id;
}

function getIntoClass(token, Result) {
    var hashId = getIdFromUrl(designUrl(getUrl(input_url)));
    if (Result.data.classroomObjs.length >= 2) {
        classRoomObjsLength = Result.data.classroomObjs.length;
    }
    var idClassRoom = getClassRoomsId(Result.data.classroomObjs);

    console.log("Join Time ", countClassRoomIn);

    var url = "https://api.azota.vn/api/FrontStudent/SaveStudentForExam";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (JSON.parse(xhr.responseText).success == 0) {
                console.log("Join Failed")
                if (classRoomObjsLength > 1 && countClassRoomIn < classRoomObjsLength) {
                    getIntoClass(token, Result);
                } else {
                    console.log("Join Into Class Failed")

                    var studentsNotVerifiedId = studentsIsNotVerified(Result.data.studentObjs);
                    if (studentsNotVerifiedId) {
                        console.log("Try Faking Student Infor")
                        tryFakingStudentInfor(studentsNotVerifiedId, hashId, token);
                    } else {
                        console.log("There is no students for faking")

                        backToDefaultHome();
                        classRoomObjsLength = 1;
                        countClassRoomIn = 0;
                    }
                }
            } else {
                console.log("Join Into Class Ok")
                sendRequest(getIdFromUrl(designUrl(getUrl(input_url))), token, JSON.parse(xhr.responseText).data);
                classRoomObjsLength = 1;
                countClassRoomIn = 0;
            }
        }
    };

    var data = `{
      "fullName": "?*𝑈𝑛𝑘𝑛𝑜𝑤𝑛𝑁𝑎𝑚𝑒 𝟱𝟬𝟭 - 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑠𝑡𝑢𝑑𝑒𝑛𝑡 𝑖𝑛𝘧𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛",
      "examHashId": "${hashId}",
      "classroomId": "${idClassRoom}"
    }`;

    xhr.send(data);

}

function studentsIsNotVerified(studentLists) {
    var studentsId = [];
    for (var student of studentLists) {
        if (!student.isVerified) {
            studentsId.push({
                id: student.id,
                classId: student.classroomId
            });
            break;
        }
    }

    return studentsId[0];
}

function tryFakingStudentInfor(studentsNotVerifiedId, hashId, token) {
    var url = `https://api.azota.vn/api/FrontStudent/AddStudentToClassForExam?examHashId=${hashId}&classroomId=${studentsNotVerifiedId.classId}&studentId=${studentsNotVerifiedId.id}`;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var Response = JSON.parse(xhr.responseText);
            if (Response.success) {
                console.log("Faking Infor Ok")
                sendRequest(getIdFromUrl(designUrl(getUrl(input_url))), token, JSON.parse(xhr.responseText).data);
                classRoomObjsLength = 1;
                countClassRoomIn = 0;
            } else {

                backToDefaultHome();
                classRoomObjsLength = 1;
                countClassRoomIn = 0;
            }
        }
    };

    xhr.send();
}