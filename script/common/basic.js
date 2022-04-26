/*显示更新头像的弹窗*/
$("#content").on("click", "#basInfoDiv #updtAvatar", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='updtMyAvatarDiv' name='updtMyAvatarDiv'>" +
        "<form id='updtMyAvatarFrm' name='updtMyAvatarFrm' enctype='multipart/form-data' " +
        "action='../../library/common/update_myavatar.php' method='post' target='doNotRefresh' onsubmit='return checkMyAvatar()'>" +
        "<table id='updtMyAvatarTbl' name='updtMyAvatarTbl'><tr><th colspan='2'><span>上传头像</span></th></tr>" +
        "<tr><td><label>头像文件</label></td><td><input type='file' id='newAvatar' name='newAvatar' /></td></tr>" +
        "<tr><td><input type='button' id='cnlUpdtMyAvatarBtn' value='取消' /></td>" +
        "<td><input type='submit' id='updtMyAvatarBtn' value='上传' /></td></tr></table></form>" +
        "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

/*检查上传头像文件的函数*/
function checkMyAvatar() {
    let newAvatar = $("body").find("#updtMyAvatarDiv").find("#updtMyAvatarFrm").find("#updtMyAvatarTbl").find("#newAvatar").val();

    if (newAvatar == "") { alert("请选择待上传的头像图片文件后再执行上传操作"); return false; }

    return true;
}

/*取消更新头像*/
$("body").on("click", "#updtMyAvatarDiv #updtMyAvatarFrm #updtMyAvatarTbl #cnlUpdtMyAvatarBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");
    $("body").find("#updtMyAvatarDiv").remove();

    $.ajax({
        url: "../../library/common/obtain_info.php",
        type: "POST",
        async: false,
        data: { usrID: usrInfo["UsrID"], usrRole: usrInfo["UsrRole"] },
        error: function () { alert("查询用户信息失败，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "successful") {
                $.ajax({
                    url: "../../library/session/check_sessn.php",
                    type: "GET",
                    async: false,
                    dataType: "json",
                    error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
                    success: function (usrInfoJSON) {
                        if (usrInfoJSON["error"] === "启动会话时发生错误，请联系管理员并反馈问题")
                            alert("启动会话时发生错误，请联系管理员并反馈问题");
                        else usrInfo = usrInfoJSON;

                        cnlUpdtInfo();
                    }
                });
            } else alert(status);
        }
    });
});

/*编辑个人信息*/
$("#content").on("click", "#basInfoDiv #editBasInfoBtn", function () {
    $("#content").find("#basInfoDiv").find("#updtAvatar").attr("disabled", "disabled");
    $("#content").find("#basInfoDiv").find("#editBasInfoBtn").attr("style", "visibility: hidden;");
    $("#content").find("#basInfoDiv").find("#cnlEditInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#basInfoDiv").find("#updtBasInfoBtn").attr("style", "visibility: visible;");

    $("#content").find("#basInfoDiv").find("#usrName").val(usrInfo["UsrName"]).removeAttr("placeholder").removeAttr("disabled");
    $("#content").find("#basInfoDiv").find("#usrGen").removeAttr("disabled");
    $("#content").find("#basInfoDiv").find("#usrAdms").removeAttr("disabled").empty();
    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    if (usrInfo["UsrRole"] != "std") $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='null'>暂无</option>");
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
    $("#content").find("#basInfoDiv").find("#usrAdms").find("option[value='" + usrInfo["UsrAdms"] + "']").attr("selected", "selected");
    $("#content").find("#basInfoDiv").find("#colgAbrv").removeAttr("disabled");
    $("#content").find("#basInfoDiv").find("#mjrAbrv").removeAttr("disabled");
});

/*切换学院时查询该学院下设专业*/
$("#content").on("change", "#basInfoDiv #colgAbrv", function () {
    $.ajax({
        url: "../../library/common/query_mjr.php",
        type: "GET",
        async: false,
        data: { usrRole: usrInfo["UsrRole"], colgAbrv: $("#content").find("#basInfoDiv").find("#colgAbrv").val() },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (mjrJSON) {
            $("#content").find("#basInfoDiv").find("#mjrAbrv").empty();
            for (let indx = 0; indx < mjrJSON.length; indx++) $("#content").find("#basInfoDiv").find("#mjrAbrv").append(
                "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
            );
        }
    });
});

/*取消编辑个人信息*/
$("#content").on("click", "#basInfoDiv #cnlEditInfoBtn", function () {
    cnlUpdtInfo();
});

/*实现取消更新信息后恢复页面的函数*/
function cnlUpdtInfo() {
    $("#content").find("#basInfoDiv").find("#updtAvatar").removeAttr("disabled");
    $("#content").find("#basInfoDiv").find("#editBasInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#basInfoDiv").find("#cnlEditInfoBtn").attr("style", "visibility: hidden;");
    $("#content").find("#basInfoDiv").find("#updtBasInfoBtn").attr("style", "visibility: hidden;");

    $("#content").find("#basInfoDiv").find("#usrName").attr("placeholder", usrInfo["UsrName"]).val("").attr("disabled", "disabled");
    $("#content").find("#basInfoDiv").find("#usrGen").empty();
    $("#content").find("#basInfoDiv").find("#usrGen").append("<option value='male'>男</option><option value='female'>女</option>");
    $("#content").find("#basInfoDiv").find("#usrGen").find("option[value='" + usrInfo["UsrGen"] + "']").attr("selected", "selected");
    $("#content").find("#basInfoDiv").find("#usrGen").attr("disabled", "disabled");
    $("#content").find("#basInfoDiv").find("#usrAdms").empty();
    if (usrInfo["UsrAdms"] != null) $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='" + usrInfo["UsrAdms"] + "'>" + usrInfo["UsrAdms"] + "</option>");
    else $("#content").find("#basInfoDiv").find("#usrAdms").append("<option value='null'>暂无</option>");
    $("#content").find("#basInfoDiv").find("#usrAdms").attr("disabled", "disabled");
    $.ajax({
        url: "../../library/common/query_colg.php",
        type: "GET",
        async: false,
        data: { usrRole: usrInfo["UsrRole"] },
        dataType: "json",
        error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
        success: function (colgJSON) {
            $("#content").find("#basInfoDiv").find("#colgAbrv").empty();
            for (let indx = 0; indx < colgJSON.length; indx++) {
                $("#content").find("#basInfoDiv").find("#colgAbrv").append(
                    "<option value='" + colgJSON[indx].ColgAbrv + "'>" + colgJSON[indx].ColgName + "</option>"
                );
            }
            $("#content").find("#basInfoDiv").find("#colgAbrv").find("option[value='" + usrInfo["ColgAbrv"] + "']").attr("selected", "selected");
            if (usrInfo["MjrAbrv"] != null) {
                $.ajax({
                    url: "../../library/common/query_mjr.php",
                    type: "GET",
                    async: false,
                    data: { usrRole: usrInfo["UsrRole"], colgAbrv: usrInfo["ColgAbrv"] },
                    dataType: "json",
                    error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
                    success: function (mjrJSON) {
                        $("#content").find("#basInfoDiv").find("#mjrAbrv").empty();
                        for (let indx = 0; indx < mjrJSON.length; indx++) {
                            $("#content").find("#basInfoDiv").find("#mjrAbrv").append(
                                "<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>"
                            );
                        }
                        $("#content").find("#basInfoDiv").find("#mjrAbrv").find("option[value='" + usrInfo["MjrAbrv"] + "']").attr("selected", "selected");
                    }
                });
            } else {
                $("#content").find("#basInfoDiv").find("#mjrAbrv").empty();
                $("#content").find("#basInfoDiv").find("#mjrAbrv").append("<option value='null'>暂无</option>");
            }
        }
    });
    $("#content").find("#basInfoDiv").find("#colgAbrv").attr("disabled", "disabled");
    $("#content").find("#basInfoDiv").find("#mjrAbrv").attr("disabled", "disabled");
}

/*检查姓名完整性*/
$("#content").on("focusout", "#basInfoDiv #usrName", function () {
    let usrName = $("#content").find("#basInfoDiv").find("#usrName").val();

    if (usrName === "") $("#content").find("#basInfoDiv").find("#usrName").attr("placeholder", "请输入姓名");
});

/*更新用户信息*/
$("#content").on("click", "#basInfoDiv #updtBasInfoBtn", function () {
    let usrID = usrInfo["UsrID"];
    let usrName = $("#content").find("#basInfoDiv").find("#usrName").val();
    let usrGen = $("#content").find("#basInfoDiv").find("#usrGen").val();
    let usrAdms = $("#content").find("#basInfoDiv").find("#usrAdms").val();
    let colgAbrv = $("#content").find("#basInfoDiv").find("#colgAbrv").val();
    let mjrAbrv = $("#content").find("#basInfoDiv").find("#mjrAbrv").val();

    if (usrName != "") {
        $.ajax({
            url: "../../library/common/update_info.php",
            type: "POST",
            async: false,
            data: {
                usrID: usrID, usrName: usrName, usrGen: usrGen, usrRole: usrInfo["UsrRole"],
                usrAdms: usrAdms, colgAbrv: colgAbrv, mjrAbrv: mjrAbrv
            },
            error: function () { alert("连接数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    $.ajax({
                        url: "../../library/common/obtain_info.php",
                        type: "POST",
                        async: false,
                        data: { usrID: usrInfo["UsrID"], usrRole: usrInfo["UsrRole"] },
                        error: function () { alert("查询用户信息失败，请联系管理员并反馈问题"); },
                        success: function (status) {
                            if (status === "successful") {
                                $.ajax({
                                    url: "../../library/session/check_sessn.php",
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
                                    success: function (usrInfoJSON) {
                                        if (usrInfoJSON["error"] === "启动会话时发生错误，请联系管理员并反馈问题")
                                            alert("启动会话时发生错误，请联系管理员并反馈问题");
                                        else usrInfo = usrInfoJSON;

                                        cnlUpdtInfo();
                                    }
                                });
                            } else alert(status);
                        }
                    });
                } else alert(status);
            }
        });
    }
});