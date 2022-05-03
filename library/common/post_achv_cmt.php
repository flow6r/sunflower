<?php
/*评论学生作业的脚本*/
//获取POST请求的数据
$achvID = intval($_POST["achvID"]);
$cmtTxt = $_POST["cmtTxt"];
$usrID = $_POST["usrID"];
$usrRole = $_POST["usrRole"];

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

//查询数据库
$query = "SELECT AchvID FROM Achievement WHERE AchvID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $achvID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $query = "INSERT INTO Comment VALUES (NULL, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("iss", $achvID, $usrID, $cmtTxt);
    $stmt->execute();
    echo "successful";
} else echo "查询作品ID失败，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>