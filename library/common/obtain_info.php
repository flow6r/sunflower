<?php
/*获取用户信息的脚本*/
//获取POST请求的数据
$usrRole = $_POST["usrRole"];
$usrID = $_POST["usrID"];

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

//查询数据库，获取用户信息
$query = "SELECT UsrID, UsrName, UsrGen, UsrRole, UsrEmail, UsrAdms, ColgAbrv, MjrAbrv FROM User WHERE UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $usrID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($UsrID, $UsrName, $UsrGen, $UsrRole, $UsrEmail, $UsrAdms, $ColgAbrv, $MjrAbrv);
    $stmt->fetch();
    require_once("../session/user_info.php");
    echo "successful";
} else echo "查询用户信息时发生错误，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>