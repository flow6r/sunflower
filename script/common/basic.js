/*编辑个人信息*/
$("#content").on("click", "#basInfoDiv #editBasInfoBtn", function () {
    $("#content").find("#basInfoDiv").find("#editBasInfoBtn").attr("style", "visibility: hidden;");
    $("#content").find("#basInfoDiv").find("#cnlEditInfoBtn").attr("style", "visibility: visible;");
    $("#content").find("#basInfoDiv").find("#updtBasInfoBtn").attr("style", "visibility: visible;");
});