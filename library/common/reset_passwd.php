<?php
/*重置用户密码的脚本*/
//获取POST请求的数据
$usrRole = $_POST["usrRole"];
$newPasswd = $_POST["newPasswd"];

//启动会话
session_start();
//获取用户电子邮箱
$usrEmail = $_SESSION["usrEmail"];

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
    default:
        require_once("../dbuser/temp.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//加密密码
$newPasswd = password_hash($newPasswd, PASSWORD_BCRYPT);

//查询数据库
$query = "UPDATE User SET UsrPasswd = ? WHERE UsrEmail = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $newPasswd, $usrEmail);
$stmt->execute();

echo "successful";

//关闭链接
$db->close();
exit;
?>