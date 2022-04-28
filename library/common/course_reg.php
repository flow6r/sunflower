<?php
/*学生参加课程的脚本*/
//获取POST请求的数据
$crseID = intval($_POST["crseID"]);
$usrID = $_POST["usrID"];

//引入数据库用户信息脚本
require_once("../dbuser/student.php");


//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT CrseID FROM Course WHERE CrseID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $crseID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    $query = "SELECT * FROM Schedule WHERE CrseID = ? AND UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("is", $crseID, $usrID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $query = "INSERT INTO Schedule VALUES (?, ?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("is", $crseID, $usrID);
        $stmt->execute();
        echo "successful";
    } else echo "您已选课，请勿重复选课";
} else echo "查询课程失败，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>