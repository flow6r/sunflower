<?php
/*删除成就记录的脚本*/
//获取POST请求的数据
$achvID = intval($_POST["achvID"]);
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

//查询数据库并删除成就记录
$query = "SELECT AchvPath FROM Achievement WHERE AchvID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $achvID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($achvPath);
    $stmt->fetch();
    $achvPath = substr($achvPath, 2);
    unlink($docRoot . $achvPath);
    $query = "DELETE FROM Achievement WHERE AchvID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $achvID);
    $stmt->execute();
    echo "successful";
} else echo "查询成就记录失败，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>