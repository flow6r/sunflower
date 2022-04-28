<?php
/*更新课程信息的脚本*/
//获取POST请求的数据
$crseName = $_POST["crseName"];
$usrName = $_POST["usrName"];
$crseDesc = $_POST["crseDesc"];
$usrRole = $_POST["usrRole"];
$colgAbrv = $_POST["colgAbrv"];

//获取当前课程的ID
session_start();
$crseID = intval($_SESSION["currCrse"]["CrseID"]);

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

//查询教师ID
$query = "SELECT UsrID FROM User WHERE UsrRole = 'tch' AND ColgAbrv = ? AND UsrName = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $colgAbrv, $usrName);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($usrID);
    $stmt->fetch();
    $stmt->free_result();
} else {
    echo "查询教师用户失败，请检查无误后再执行更新操作，或联系管理员并反馈问题";
    $stmt->free_result();
    $db->close();
    exit;
}

//查询课程ID
$query = "SELECT CrseID FROM Course WHERE CrseID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $crseID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $query = "UPDATE Course SET CrseName = ?, CrseDesc = ?, UsrID = ? WHERE CrseID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sssi", $crseName, $crseDesc, $usrID, $crseID);
    $stmt->execute();
    echo "successful";
} else echo "查询教师用户失败，请检查无误后再执行更新操作，或联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>