var toBeUpdtEmail = null;

/*显示更新电子邮箱的弹窗*/
$("#content").on("click", "#secInfoDiv #updtEmailBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='secInfo-CqtTips' class='secInfo-Tips'><span>已将验证码发送至新邮箱，请查收</span></div>" +
        "<div id='secInfo-UpdtEmailDiv' class='secInfo-UpdtDiv'><form id='secInfo-UpdtEmailFrm' name='secInfo-UpdtEmailFrm' class='secInfo-UpdtFrm'>" +
        "<table id='secInfo-UpdtEmailTbl' class='secInfo-UpdtTbl'><tr><th colspan='2'><span>验证用户密码</span></th></tr>" +
        "<tr><td colspan='2'><input type='password' id='usrPasswd' name='usrPasswd' class='secInfo-Input' maxlength='18' /></td></tr>" +
        "<tr><td><input type='button' class='cnlUpdtBtn' value='取消' /></td>" +
        "<td><input type='button' id='verfUsrPasswdBtn' name='verfUsrPasswdBtn' class='contBtn' value='继续' /></td></tr>" +
        "</table></form></div><div id='secInfo-ErrTips' class='secInfo-Tips'><span></span></div>"
    );
});

/*更新电子邮箱时检查密码完整性*/
$("body").on("focusout", "#secInfo-UpdtEmailDiv #usrPasswd", function () {
    let usrPasswd = $("body").find("#secInfo-UpdtEmailDiv").find("#usrPasswd").val();

    if (usrPasswd === "") $("body").find("#secInfo-UpdtEmailDiv").find("#usrPasswd").attr("placeholder", "请输入密码");
    else $("body").find("#secInfo-UpdtEmailDiv").find("#usrPasswd").removeAttr("placeholder");
});

/*更新电子邮箱时验证密码正确性*/
$("body").on("click", "#secInfo-UpdtEmailDiv #verfUsrPasswdBtn", function () {
    let usrPasswd = $("body").find("#secInfo-UpdtEmailDiv").find("#usrPasswd").val();

    if (usrPasswd != "") {
        $.ajax({
            url: "../../library/common/verify_passwd.php",
            type: "POST",
            async: false,
            data: { usrID: usrInfo["UsrID"], usrRole: usrInfo["UsrRole"], usrPasswd: usrPasswd },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "valid") {
                    $("body").find("#secInfo-ErrTips").find("span").empty();
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");

                    $("body").find("#secInfo-UpdtEmailDiv").find("#secInfo-UpdtEmailTbl").empty();
                    $("body").find("#secInfo-UpdtEmailDiv").find("#secInfo-UpdtEmailTbl").append(
                        "<tr><th colspan='2'><span>验证新电子邮箱</span></th></tr>" +
                        "<tr><td colspan='2'><input type='email' id='newEmail' name='newEmail' class='secInfo-Input' maxlength='100' /></td></tr>" +
                        "<tr><td><input type='button' class='cnlUpdtBtn' value='取消' /></td>" +
                        "<td><input type='button' id='verfNewEmailBtn' name='verfNewEmailBtn' class='contBtn' value='继续' /></td></tr>"
                    );
                } else {
                    $("body").find("#secInfo-ErrTips").find("span").empty();
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                    $("body").find("#secInfo-ErrTips").find("span").append(status);
                }
            }
        })
    } else $("body").find("#secInfo-UpdtEmailDiv").find("#usrPasswd").attr("placeholder", "请输入密码");
});

/*更新电子邮箱时检查电子邮箱完整性*/
$("body").on("focusout", "#secInfo-UpdtEmailDiv #newEmail", function () {
    let newEmail = $("body").find("#secInfo-UpdtEmailDiv").find("#newEmail").val();

    if (newEmail === "") $("body").find("#secInfo-UpdtEmailDiv").find("#newEmail").attr("placeholder", "请输入电子邮箱");
    else $("body").find("#secInfo-UpdtEmailDiv").find("#newEmail").removeAttr("placeholder");

});

/*更新电子邮箱时验证新电子邮箱正确性*/
$("body").on("focusout", "#secInfo-UpdtEmailDiv #verfNewEmailBtn", function () {
    let newEmail = $("body").find("#secInfo-UpdtEmailDiv").find("#newEmail").val();

    if (newEmail === usrInfo["UsrEmail"]) {
        $("body").find("#secInfo-ErrTips").find("span").empty();
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("新邮箱与原邮箱一致");
    } else if (newEmail != "") {
        $.ajax({
            url: "../../library/common/verify_email.php",
            type: "POST",
            async: false,
            data: { usrRole: usrInfo["UsrRole"], UsrEmail: newEmail },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "valid") {
                    $("body").find("#secInfo-ErrTips").find("span").empty();
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                    $("body").find("#secInfo-ErrTips").find("span").append("该邮箱已被绑定");
                } else {
                    $.ajax({
                        url: "../../library/common/send_code.php",
                        type: "POST",
                        async: false,
                        data: { usrEmail: newEmail },
                        error: function () { alert("发送验证码失败，请联系管理员并反馈问题"); },
                        success: function (status) {
                            if (status === "successful") {
                                $("body").find("#secInfo-ErrTips").find("span").empty();
                                $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");

                                $("body").find("#secInfo-CqtTips").attr("style", "visibility: visible");

                                $("body").find("#secInfo-UpdtEmailDiv").find("#secInfo-UpdtEmailTbl").empty();
                                $("body").find("#secInfo-UpdtEmailDiv").find("#secInfo-UpdtEmailTbl").append(
                                    "<tr><th colspan='2'><span>验证码</span></th></tr>" +
                                    "<tr><td colspan='2'><input type='text' id='verfCode' name='verfCode' class='secInfo-Input' maxlength='5' /></td></tr>" +
                                    "<tr><td><input type='button' class='cnlUpdtBtn' value='取消' /></td>" +
                                    "<td><input type='button' id='verfCodeBtn' name='verfCodeBtn' class='contBtn' value='继续' /></td></tr>");
                            } else {
                                $("body").find("#secInfo-ErrTips").find("span").empty();
                                $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                                $("body").find("#secInfo-ErrTips").find("span").append("发送验证码失败，请联系管理员并反馈问题");
                            }
                        }
                    });
                }
            }
        });
    } else $("body").find("#secInfo-UpdtEmailDiv").find("#newEmail").removeAttr("placeholder");
});

/*更新邮箱时检查随机验证码完成性*/
$("body").on("focusout", "#secInfo-UpdtEmailDiv #verfCode", function () {
    let verfCode = $("body").find("#secInfo-UpdtEmailDiv").find("#verfCode").val();

    if (verfCode === "") $("body").find("#secInfo-UpdtEmailDiv").find("#verfCode").attr("placeholder", "请输入验证码");
    else $("body").find("#secInfo-UpdtEmailDiv").find("#verfCode").removeAttr("placeholder");
});

/*实现从会话中获取新邮箱的函数*/
function obtainNewEmail() {
    $.ajax({
        url: "../../library/common/obtain_email.php",
        type: "POST",
        async: false,
        error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
        success: function (status) {
            if (status === "failed") {
                $("body").find("#secInfo-ErrTips").find("span").empty();
                $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                $("body").find("#secInfo-ErrTips").find("span").append("启动会话失败，请联系管理员并反馈问题");
            }
            toBeUpdtEmail = status;
        }
    });
}

/*实现获取更新后的用户信息的函数*/
function obtainUpdtedUsrInfo() {
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
                        if (usrInfoJSON["error"] === "启动会话时发生错误，请联系管理员并反馈问题") {
                            $("body").find("#secInfo-ErrTips").find("span").empty();
                            $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                            $("body").find("#secInfo-ErrTips").find("span").append("启动会话失败，请联系管理员并反馈问题");
                        } else usrInfo = usrInfoJSON;
                    }
                });
            } else {
                $("body").find("#secInfo-ErrTips").find("span").empty();
                $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                $("body").find("#secInfo-ErrTips").find("span").append("启动会话失败，请联系管理员并反馈问题");
            }
        }
    });
}

/*更新邮箱时验证随机验证码正确性*/
$("body").on("click", "#secInfo-UpdtEmailDiv #verfCodeBtn", function () {
    let verfCode = $("body").find("#secInfo-UpdtEmailDiv").find("#verfCode").val();

    $("body").find("#secInfo-CqtTips").attr("style", "visibility: hidden");
    $("body").find("#secInfo-ErrTips").find("span").empty();
    $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");

    if (verfCode != "") {
        $.ajax({
            url: "../../library/common/verify_code.php",
            type: "POST",
            async: false,
            data: { verfCode: verfCode },
            error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "valid") {
                    obtainNewEmail();
                    if (toBeUpdtEmail != "failed") {
                        $.ajax({
                            url: "../../library/common/update_email.php",
                            type: "POST",
                            async: false,
                            data: { usrID: usrInfo["UsrID"], usrRole: usrInfo["UsrRole"], newEmail: toBeUpdtEmail },
                            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
                            success: function (status) {
                                if (status === "successful") {
                                    obtainUpdtedUsrInfo();
                                    cnlUpdtSecInfo();
                                    alert("成功更新电子邮箱");
                                    $("#content").find("#secInfoDiv").find("#usrEmail").attr("placeholder", usrInfo["UsrEmail"]);
                                } else {
                                    $("body").find("#secInfo-ErrTips").find("span").empty();
                                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                                    $("body").find("#secInfo-ErrTips").find("span").append("查询用户失败，请联系管理员并反馈问题");
                                }
                            }
                        });
                    }
                } else {
                    $("body").find("#secInfo-ErrTips").find("span").empty();
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                    $("body").find("#secInfo-ErrTips").find("span").append("验证码错误");
                }
            }
        });
    } else $("body").find("#secInfo-UpdtEmailDiv").find("#verfCode").attr("placeholder", "请输入验证码");
});

/*取消更新*/
$("body").on("click", "#secInfo-UpdtEmailDiv .cnlUpdtBtn", function () {
    cnlUpdtSecInfo();
});

/*实现取消更新安全设置的函数*/
function cnlUpdtSecInfo() {
    $("#mask").attr("style", "visibility: hidden;");

    $(".secInfo-UpdtDiv").remove();
    $(".secInfo-Tips").remove();
}