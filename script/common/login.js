/*检查用户ID完整性*/
$("#loginDiv").on("focusout", "#usrID", function () {
    let usrID = $("#loginDiv").find("#usrID").val();

    if (usrID === "") $("#loginDiv").find("#usrID").attr("placeholder", "请输入用户ID");
    else $("#loginDiv").find("#usrID").removeAttr("placeholder");
});

/*检查用户密码完整性*/
$("#loginDiv").on("focusout", "#usrPasswd", function () {
    let usrPasswd = $("#loginDiv").find("#usrPasswd").val();

    if (usrPasswd === "") $("#loginDiv").find("#usrPasswd").attr("placeholder", "请输入密码");
    else $("#loginDiv").find("#usrPasswd").removeAttr("placeholder");
});

/*验证登录信息*/
$("#loginDiv").on("click", "#loginBtn", function () {
    let usrID = $("#loginDiv").find("#usrID").val();
    let usrPasswd = $("#loginDiv").find("#usrPasswd").val();

    if (usrID === "" || usrPasswd === "") {
        $("#loginDiv").find("#tips").attr("style", "visibility: visible;");
        $("#loginDiv").find("#usrID").attr("placeholder", "请输入用户ID");
        if (usrID === "" && usrPasswd === "") {
            $("#loginDiv").find("#usrPasswd").attr("placeholder", "请输入密码");
            $("#loginDiv").find("#tips").attr("placeholder", "请完善登录信息");
        }
    }
    else {
        $.ajax({
            url: "../../library/common/check_login.php",
            type: "POST",
            async: false,
            data: { usrID: usrID, usrPasswd: usrPasswd },
            error: function () { alert("查询数据库失败，请联系管理员并反馈问题"); },
            success: function (status) {
                if (status === "successful") window.location.href = "../../page/panel.html";
                else {
                    if (status.length > 6) alert(status);
                    else {
                        $("#loginDiv").find("#tips").attr("placeholder", status);
                        $("#loginDiv").find("#tips").attr("style", "visibility: visible;");
                    }
                }
            }
        });
    }
});