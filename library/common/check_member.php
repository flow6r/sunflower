<?php
/*查询学生是否可以创建小组的脚本*/
//获取POST请求
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
$query = "SELECT M.UsrID FROM Party AS P, Member AS M WHERE P.CrseID = ? AND " .
"P.PtyID = M.PtyID AND M.UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("is", $crseID, $usrID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "exist";
else echo "non-existent";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>