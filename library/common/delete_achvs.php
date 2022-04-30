<?php
/*批量删除成就记录的脚本*/
//获取POST请求的数据
$achvIDAray = $_POST["achvIDAray"];
$usrRole = $_POST["usrRole"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//引入数据库用户信息脚本
switch ($usrRole) {
    case "std":
        require_once("../dbuser/student.php");
        break;
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

//声明无法删除的小组ID数组
$canDel = true;
$cantDelAchvID = array();
$cantDelAchvIDIndx = 0;

//检查小组记录是否存在
for ($indx = 0; $indx < count($achvIDAray); $indx++) {
    $currAchvID = intval($achvIDAray[$indx]);
    $query = "SELECT AchvID FROM Achievement WHERE AchvID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currAchvID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $canDel = false;
        $cantDelAchvID[$cantDelAchvIDIndx++] = $currAchvID;
    } $stmt->free_result();
}

//删除小组记录或提示错误信息
if ($canDel) {
    for ($indx = 0; $indx < count($achvIDAray); $indx++) {
        $currAchvID = intval($achvIDAray[$indx]);
        $query = "SELECT AchvPath FROM Achievement WHERE AchvID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currAchvID);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($achvPath);
        $stmt->fetch();
        $achvPath = substr($achvPath, 2);
        unlink($docRoot . $achvPath);
        $query = "DELETE FROM Achievement WHERE AchvID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currAchvID);
        $stmt->execute();
    } echo "successful";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantDelAchvID); $indx++)
        $tips .= "\n成就ID：" . $cantDelAchvID[$indx];
    echo "查询数据库时发生错误，以下成就不存在：" . $tips . "\n请检查无误后再执行批量删除操作";
}

//关闭链接
$db->close();
exit;
?>