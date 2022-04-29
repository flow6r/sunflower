<?php
/*删除课程任务记录的脚本*/
//获取POST请求的数据
$msID = intval($_POST["msID"]);
$usrRole = $_POST["usrRole"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

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
$query = "SELECT PkgPath FROM Mission WHERE MsID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $msID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($pkgPath);
    $stmt->fetch();
    $query = "DELETE FROM Mission WHERE MsID = ?";
    $stmt->bind_param("i", $msID);
    $stmt->execute();
    $pkgPath = substr($pkgPath, 2);
    unlink($docRoot . $pkgPath);
    echo "successful";
} else echo "查询课程任务失败，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>