<?php
/*更新任务详情的脚本*/
//获取POST请求的数据
$msID = intval($_POST["msID"]);
$msName = $_POST["msName"];
$msDesc = $_POST["msDesc"];
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

//查询数据库
$query = "SELECT * FROM Mission WHERE MsID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $msID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    $query = "UPDATE Mission SET MsName = ?, MsDesc = ? WHERE MsID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ssi", $msName, $msDesc, $msID);
    $stmt->execute();
    echo "successful";
} else echo "查询课程任务失败，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>