<?php
/*更新小组信息的脚本*/
//获取POST请求的数据
$ptyID = intval($_POST["ptyID"]);
$ptyName = $_POST["ptyName"];
$IDAndResp = $_POST["IDAndResp"];
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

//更新小组名称
$query = "UPDATE Party SET PtyName = ? WHERE PtyID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("si", $ptyName, $ptyID);
$stmt->execute();

//更新成员职务
for ($indx= 0; $indx < count($IDAndResp); $indx++) {
    $query = "UPDATE Member SET UsrResp = ? WHERE PtyID = ? AND UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sis", $IDAndResp[$indx][1], $ptyID, $IDAndResp[$indx][0]);
    $stmt->execute();
}

echo "successful";

//关闭链接
$db->close();
exit;
?>