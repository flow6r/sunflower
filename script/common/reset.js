$("#rstDiv").on("focusout", "#usrEmail", function () {
    let usrEmail = $("#rstDiv").find("#usrEmail").val();

    if (usrEmail === "") $("#rstDiv").find("#usrEmail").attr("placeholder", "请输入电子邮箱");
    else $("#rstDiv").find("#usrEmail").removeAttr("placeholder");
});

$("#rstDiv").on("click", "#verfEmailBtn", function () {
    let usrEmail = $("#rstDiv").find("#usrEmail").val();

    if (usrEmail != "") {
        $.ajax({
            url: "../../library/common/verify_email.php",
            type: "POST",
            async: false,
            data: { usrRole: "temp", usrEmail: usrEmail },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    $.ajax({
                        url: "../../library/common/send_code.php",
                        type: "POST",
                        async: false,
                        data: { usrEmail: usrEmail },
                        error: function () { alert("发送验证码失败，请联系管理员并反馈问题"); },
                        success: function (status) {
                            if (status === "successful") {
                                $("#sent").attr("style", "visibility: visible;");
                                $("#tips").find("span").empty();
                                $("#tips").attr("style", "visibility: hidden;");

                                $("#rstDiv").find("#rstFrm").find("#rstTbl").empty();
                                $("#rstDiv").find("#rstFrm").find("#rstTbl").append(
                                    "<tr><th><span>验证码</span></th></tr>" +
                                    "<tr><td><input type='text' id='verfCode' name='verfCode' maxlength='5' /></td></tr>" +
                                    "<tr><td><input type='button' id='verfCodeBtn' name='verfCodeBtn' value='继续' /></td></tr>"
                                );
                            } else {
                                $("#tips").find("span").empty();
                                $("#tips").attr("style", "visibility: visible;");
                                $("#tips").find("span").append("发送验证码失败，请联系管理员并反馈问题");
                            }
                        }
                    });
                } else {
                    $("#tips").find("span").empty();
                    $("#tips").attr("style", "visibility: visible;");
                    $("#tips").find("span").append(status);
                }
            }
        });
    } else $("#rstDiv").find("#usrEmail").attr("placeholder", "请输入电子邮箱");
});

$("#rstDiv").on("focusout", "#verfCode", function () {
    let verfCode = $("#rstDiv").find("#verfCode").val();

    if (verfCode === "") $("#rstDiv").find("#verfCode").attr("placeholder", "请输入验证码");
    else $("#rstDiv").find("#usrEmail").removeAttr("placeholder");
});

$("#rstDiv").on("click", "#verfCodeBtn", function () {
    let verfCode = $("#rstDiv").find("#verfCode").val();

    $("#sent").attr("style", "visibility: hidden;");
    $("#tips").find("span").empty();
    $("#tips").attr("style", "visibility: hidden;");

    if (verfCode != "") {
        $.ajax({
            url: "../../library/common/verify_code.php",
            type: "POST",
            async: false,
            data: { verfCode: verfCode },
            error: function () { alert("启动会话时发生错误，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "valid") {
                    $("#tips").find("span").empty();
                    $("#tips").attr("style", "visibility: hidden;");

                    $("#rstDiv").find("#rstFrm").find("#rstTbl").empty();
                    $("#rstDiv").find("#rstFrm").find("#rstTbl").append(
                        "<tr><td style='float: left;'><label>新密码</label></td></tr>" +
                        "<tr><td><input type='password' id='newPasswd' name='newPasswd' maxlength='18' title='密码由6-18位的英文字母、数字和特殊字符组成' /></td></tr>" +
                        "<tr><td style='float: left;'><label>重复密码</label></td></tr>" +
                        "<tr><td><input type='password' id='verfPasswd' name='verfPasswd' maxlength='18' title='密码由6-18位的英文字母、数字和特殊字符组成' /></td></tr>" +
                        "<tr><td><input type='button' id='rstPasswdBtn' name='rstPasswdBtn' value='重置密码' /></td></tr>"
                    );
                } else {
                    $("#tips").find("span").empty();
                    $("#tips").attr("style", "visibility: visible;");
                    $("#tips").find("span").append("验证码错误");
                }
            }
        });
    } else $("#rstDiv").find("#verfCode").attr("placeholder", "请输入验证码");
});

$("#rstDiv").on("focusout", "#newPasswd", function () {
    let newPasswd = $("#rstDiv").find("#newPasswd").val();

    $("#tips").find("span").empty();

    if (newPasswd === "") {
        $("#tips").attr("style", "visibility: hidden;");
        $("#rstDiv").find("#newPasswd").attr("placeholder", "请输入密码");
    } else if (newPasswd.length < 6 || newPasswd.length > 18) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请输入6~18位密码");
    } else {
        $("#tips").attr("style", "visibility: hidden;");
        $("#rstDiv").find("#newPasswd").removeAttr("placeholder");
    }
});

$("#rstDiv").on("focusout", "#verfPasswd", function () {
    let newPasswd = $("#rstDiv").find("#newPasswd").val();
    let verfPasswd = $("#rstDiv").find("#verfPasswd").val();

    $("#tips").find("span").empty();

    if (verfPasswd === "") {
        $("#tips").attr("style", "visibility: hidden;");
        $("#rstDiv").find("#verfPasswd").attr("placeholder", "请重复密码");
    } else if (newPasswd.length < 6 || newPasswd.length > 18) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请输入6~18位密码");
    } else if (newPasswd != verfPasswd) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("两次输入的密码不一致");
    } else {
        $("#tips").attr("style", "visibility: hidden;");
        $("#rstDiv").find("#verfPasswd").removeAttr("placeholder");
    }
});

$("#rstDiv").on("click", "#rstPasswdBtn", function () {
    let newPasswd = $("#rstDiv").find("#newPasswd").val();
    let verfPasswd = $("#rstDiv").find("#verfPasswd").val();

    $("#tips").find("span").empty();

    if (newPasswd === "" || verfPasswd === "") {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请完善密码信息");
    } else if (newPasswd.length < 6 || newPasswd.length > 18) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("请输入6~18位密码");
    } else if (newPasswd != verfPasswd) {
        $("#tips").attr("style", "visibility: visible;");
        $("#tips").find("span").append("两次输入的密码不一致");
    } else {
        $.ajax({
            url: "../../library/common/reset_passwd.php",
            type: "POST",
            async: false,
            data: { usrRole: "temp", newPasswd: newPasswd },
            error: function () { alert("更新密码失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") {
                    alert("重置密码成功");
                    window.location.href = "../../index.html";
                }
                else {
                    $("#tips").attr("style", "visibility: visible;");
                    $("#tips").find("span").append(status);
                }
            }
        });
    }
});