<?php
/*批量删除课程记录的脚本*/
//获取POST请求的数据
$usrRole = $_POST["usrRole"];
$crseIDAray = $_POST["crseIDAray"];

//引入数据库用户信息脚本
switch ($usrRole) {
    case "tch":
        require_once("../dbuser/teacher.php");
        break;
    case "admin":
        require_once("../dbuser/admin.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//声明无法删除的课程数组
$canDel = true;
$cantDelCrses = array();
$cantDelCrseIndx = 0;

//检查课程记录是否存在
for ($indx = 0; $indx < count($crseIDAray); $indx++) {
    $currCrseID = intval($crseIDAray[$indx]);
    $query = "SELECT CrseID FROM Course WHERE CrseID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currCrseID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $canDel = false;
        $cantDelCrses[$cantDelCrseIndx++] = $currCrseID;
    }
    $stmt->free_result();
}

//删除课程记录或提示错误信息
if ($canDel) {
    for ($indx = 0; $indx < count($crseIDAray); $indx++) {
        $currCrseID = intval($crseIDAray[$indx]);
        $query = "DELETE FROM Course WHERE CrseID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currCrseID);
        $stmt->execute();
    }
    echo "successful";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantDelCrses); $indx++)
        $tips .= "\n课程ID：" . $cantDelCrses[$indx];
    echo "查询数据库时发生错误，以下课程不存在：" . $tips . "\n请检查无误后再执行批量删除操作";
}

//关闭链接
$db->close();
exit;
?>