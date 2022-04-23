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
                                    "<td><input type='button' id='verfCodeBtn' name='verfCodeBtn' class='contBtn' value='继续' /></td></tr>"
                                );
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
                                    alert("成功更新电子邮箱");
                                    cnlUpdtSecInfo();
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

/*显示更新密码的弹窗*/
$("#content").on("click", "#secInfoDiv #updtPasswdBtn", function () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='secInfo-CqtTips' class='secInfo-Tips'><span>已将验证码发送至邮箱，请查收</span></div>" +
        "<div id='secInfo-UpdtPasswdDiv' class='secInfo-UpdtDiv'><form id='secInfo-UpdtPasswdFrm' name='secInfo-UpdtPasswdFrm' class='secInfo-UpdtFrm'>" +
        "<table id='secInfo-UpdtPasswdTbl' class='secInfo-UpdtTbl'><tr><th colspan='2'><span>验证电子邮箱</span></th></tr>" +
        "<tr><td colspan='2'><input type='email' id='usrEmail' name='usrEmail' class='secInfo-Input' maxlength='100' /></td></tr>" +
        "<tr><td><input type='button' class='cnlUpdtBtn' value='取消' /></td>" +
        "<td><input type='button' id='verfUsrEmailBtn' name='verfUsrEmailBtn' class='contBtn' value='继续' /></td></tr>" +
        "</table></form></div><div id='secInfo-ErrTips' class='secInfo-Tips'><span></span></div>"
    );
});

/*更新密码时检查电子邮箱完整性*/
$("body").on("focusout", "#secInfo-UpdtPasswdDiv #usrEmail", function () {
    let usrEmail = $("#secInfo-UpdtPasswdDiv").find("#usrEmail").val();

    if (usrEmail === "") $("body").find("#secInfo-UpdtPasswdDiv").find("#usrEmail").attr("placeholder", "请输入电子邮箱");
    else $("body").find("#secInfo-UpdtPasswdDiv").find("#usrEmail").removeAttr("placeholder");

});

/*更新密码时验证电子邮箱*/
$("body").on("click", "#secInfo-UpdtPasswdDiv #verfUsrEmailBtn", function () {
    let usrEmail = $("#secInfo-UpdtPasswdDiv").find("#usrEmail").val();

    $("body").find("#secInfo-ErrTips").find("span").empty();
    $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");

    if (usrEmail != "") {
        $.ajax({
            url: "../../library/common/verify_email.php",
            type: "POST",
            async: false,
            data: { usrRole: usrInfo["UsrRole"], usrEmail: usrEmail },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "valid") {
                    $.ajax({
                        url: "../../library/common/send_code.php",
                        type: "POST",
                        async: false,
                        data: { usrEmail: usrEmail },
                        error: function () { alert("发送验证码失败，请联系管理员并反馈问题"); },
                        success: function (status) {
                            if (status === "successful") {
                                $("body").find("#secInfo-CqtTips").attr("style", "visibility: visible");
                                $("body").find("#secInfo-UpdtPasswdDiv").find("#secInfo-UpdtPasswdTbl").empty();
                                $("body").find("#secInfo-UpdtPasswdDiv").find("#secInfo-UpdtPasswdTbl").append(
                                    "<tr><th colspan='2'><span>验证码</span></th></tr>" +
                                    "<tr><td colspan='2'><input type='text' id='verfCode' name='verfCode' class='secInfo-Input' maxlength='5' /></td></tr>" +
                                    "<tr><td><input type='button' class='cnlUpdtBtn' value='取消' /></td>" +
                                    "<td><input type='button' id='verfCodeBtn' name='verfCodeBtn' class='contBtn' value='继续' /></td></tr>"
                                );
                            } else {
                                $("body").find("#secInfo-ErrTips").find("span").empty();
                                $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                                $("body").find("#secInfo-ErrTips").find("span").append("发送验证码失败，请联系管理员并反馈问题");
                            }
                        }
                    });
                } else {
                    $("body").find("#secInfo-ErrTips").find("span").empty();
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                    $("body").find("#secInfo-ErrTips").find("span").append(status);
                }
            }
        });
    } else $("body").find("#secInfo-UpdtPasswdDiv").find("#usrEmail").attr("placeholder", "请输入电子邮箱");
});

/*更新密码时检查验证码完整性*/
$("body").on("focusout", "#secInfo-UpdtPasswdDiv #verfCode", function () {
    let verfCode = $("body").find("#secInfo-UpdtPasswdDiv").find("#verfCode").val();

    if (verfCode === "") $("body").find("#secInfo-UpdtPasswdDiv").find("#verfCode").attr("placeholder", "请输入验证码");
    else $("body").find("#secInfo-UpdtPasswdDiv").find("#verfCode").removeAttr("placeholder");
});

/*更新密码时验证随机验证码正确性*/
$("body").on("click", "#secInfo-UpdtPasswdDiv #verfCodeBtn", function () {
    let verfCode = $("body").find("#secInfo-UpdtPasswdDiv").find("#verfCode").val();

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
                    $("body").find("#secInfo-UpdtPasswdDiv").find("#secInfo-UpdtPasswdTbl").empty();
                    $("body").find("#secInfo-UpdtPasswdDiv").find("#secInfo-UpdtPasswdTbl").append(
                        "<tr><td colspan='2' style='float: left;'><label>新密码</label></td></tr>" +
                        "<tr><td colspan='2'><input type='password' id='newPasswd' name='newPasswd' class='secInfo-Input' maxlength='18' " +
                        "title='密码由6-18位的英文字母、数字和特殊字符组成' /></td></tr>" +
                        "<tr><td colspan='2' style='float: left;'><label>重复密码</label></td></tr>" +
                        "<tr><td colspan='2'><input type='password' id='verfPasswd' name='verfPasswd' class='secInfo-Input' maxlength='18' " +
                        "title='密码由6-18位的英文字母、数字和特殊字符组成' /></td></tr>" +
                        "<tr><td><input type='button' class='cnlUpdtBtn' value='取消' /></td>" +
                        "<td><input type='button' id='updtPasswdBtn' name='updtPasswdBtn' class='contBtn' value='继续' /></td></tr>"
                    );
                } else {
                    $("body").find("#secInfo-ErrTips").find("span").empty();
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                    $("body").find("#secInfo-ErrTips").find("span").append("验证码错误");
                }
            }
        });
    } else $("body").find("#secInfo-UpdtPasswdDiv").find("#verfCode").attr("placeholder", "请输入验证码");
});

/*更新密码时检查新密码完整性*/
$("body").on("focusout", "#secInfo-UpdtPasswdDiv #newPasswd", function () {
    let newPasswd = $("body").find("#secInfo-UpdtPasswdDiv").find("#newPasswd").val();

    $("body").find("#secInfo-ErrTips").find("span").empty();

    if (newPasswd === "") {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");
        $("body").find("#secInfo-UpdtPasswdDiv").find("#newPasswd").attr("placeholder", "请输入密码");
    } else if (newPasswd.length < 6 || newPasswd.length > 18) {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("请输入6~18位密码");
    } else $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");
});

/*更新密码时检查重复密码完整性*/
$("body").on("focusout", "#secInfo-UpdtPasswdDiv #verfPasswd", function () {
    let newPasswd = $("body").find("#secInfo-UpdtPasswdDiv").find("#newPasswd").val();
    let verfPasswd = $("body").find("#secInfo-UpdtPasswdDiv").find("#verfPasswd").val();

    $("body").find("#secInfo-ErrTips").find("span").empty();

    if (verfPasswd === "") {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: hidden");
        $("body").find("#secInfo-UpdtPasswdDiv").find("#verfPasswd").attr("placeholder", "请重复输入密码");
    } else if (newPasswd.length < 6 || newPasswd.length > 18) {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("请输入6~18位密码");
    } else if (newPasswd != verfPasswd) {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("两次输入的密码不一致");
    } else $("#tips").attr("style", "visibility: hidden;");
});

/*更新用户密码*/
$("body").on("click", "#secInfo-UpdtPasswdDiv #updtPasswdBtn", function () {
    let newPasswd = $("body").find("#secInfo-UpdtPasswdDiv").find("#newPasswd").val();
    let verfPasswd = $("body").find("#secInfo-UpdtPasswdDiv").find("#verfPasswd").val();

    $("body").find("#secInfo-ErrTips").find("span").empty();

    if (newPasswd === "" || verfPasswd === "") {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("请完善密码信息");
    } else if (newPasswd.length < 6 || newPasswd.length > 18) {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("请输入6~18位密码");
    } else if (newPasswd != verfPasswd) {
        $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
        $("body").find("#secInfo-ErrTips").find("span").append("两次输入的密码不一致");
    } else {
        $.ajax({
            url: "../../library/common/update_passwd.php",
            type: "POST",
            async: false,
            data: { usrID: usrInfo["UsrID"], usrRole: usrInfo["UsrRole"], newPasswd: newPasswd },
            error: function () { alert("更新密码失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("成功重置密码");
                    cnlUpdtSecInfo();
                } else {
                    $("body").find("#secInfo-ErrTips").attr("style", "visibility: visible");
                    $("body").find("#secInfo-ErrTips").find("span").append(status);
                }
            }
        });
    }
});

/*取消更新*/
$("body").on("click", ".secInfo-UpdtDiv .cnlUpdtBtn", function () {
    cnlUpdtSecInfo();
});

/*实现取消更新安全设置的函数*/
function cnlUpdtSecInfo() {
    $("#mask").attr("style", "visibility: hidden;");

    $(".secInfo-UpdtDiv").remove();
    $(".secInfo-Tips").remove();
}