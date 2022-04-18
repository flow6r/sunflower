<?php
/*注册学生用户的脚本*/
//获取POST请求的数据
$UsrID = $_POST["usrID"];
$UsrName = $_POST["usrName"];
$UsrPasswd = $_POST["usrPasswd"];
$UsrGen = $_POST["usrGen"];
$UsrRole = $_POST["usrRole"];
$UsrEmail = $_POST["usrEmail"];
$UsrAdms = intval($_POST["usrAdms"]);
$ColgAbrv = $_POST["colgAbrv"];
$MjrAbrv = $_POST["mjrAbrv"];

//引入数据库用户信息脚本
require_once("../dbuser/student.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT UsrID FROM User WHERE UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $UsrID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "用户已存在";
else {
    $stmt->free_result();
    $query = "SELECT UsrEmail FROM User WHERE UsrEmail = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $UsrEmail);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) echo "该邮箱已被绑定";
    else {
        $stmt->free_result();
        $UsrPasswd = password_hash($UsrPasswd, PASSWORD_BCRYPT);
        $query = "INSERT INTO User VALUES (?,?,?,?,?,?,?,?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param(
            "ssssssiss",
            $UsrID, $UsrName, $UsrPasswd,
            $UsrGen, $UsrRole, $UsrEmail,
            $UsrAdms, $ColgAbrv, $MjrAbrv
        );
        $stmt->execute();
        require_once("../session/user_info.php");
        echo "successful";
    }
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>