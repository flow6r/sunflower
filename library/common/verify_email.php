<?php
/*检查电子邮箱的脚本*/
//获取POST请求的数据
$usrRole = $_POST["usrRole"];
$usrEmail = $_POST["usrEmail"];

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
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT UsrEmail FROM User WHERE UsrEmail = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $usrEmail);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "valid";
else echo "该邮箱未被绑定";


//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>