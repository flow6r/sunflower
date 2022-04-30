<?php
/*批量删除小组记录的脚本*/
//获取POST请求的数据
$ptyIDAray = $_POST["ptyIDAray"];
$usrRole = $_POST["usrRole"];

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

//声明无法删除的小组ID数组
$canDel = true;
$cantDelPtyID = array();
$cantDelPtyIDIndx = 0;

//检查小组记录是否存在
for ($indx = 0; $indx < count($ptyIDAray); $indx++) {
    $currPtyID = intval($ptyIDAray[$indx]);
    $query = "SELECT * FROM Party WHERE PtyID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currPtyID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $canDel = false;
        $cantDelPtyID[$cantDelPtyIDIndx++] = $currPtyID;
    } $stmt->free_result();
}

//删除小组记录或提示错误信息
if ($canDel) {
    for ($indx = 0; $indx < count($ptyIDAray); $indx++) {
        $currPtyID = intval($ptyIDAray[$indx]);
        $query = "DELETE FROM Party WHERE PtyID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currPtyID);
        $stmt->execute();
    } echo "successful";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantDelPtyID); $indx++)
        $tips .= "\n小组ID：" . $cantDelPtyID[$indx];
    echo "查询数据库时发生错误，以下小组不存在：" . $tips . "\n请检查无误后再执行批量删除操作";
}

//关闭链接
$db->close();
exit;
?>