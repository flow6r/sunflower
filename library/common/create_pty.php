<?php
/*创建学习小组的脚本*/
//获取POST请求的数据
$crseID = intval($_POST["crseID"]);
$ptyName = $_POST["ptyName"];
$leaderID = $_POST["leaderID"];
$leaderResp = $_POST["leaderResp"];
$mbr1ID = $_POST["mbr1ID"];
$mbr2ID = $_POST["mbr2ID"];
$mbr3ID = $_POST["mbr3ID"];
$mbr4ID = $_POST["mbr4ID"];
$mbr1Resp = $_POST["mbr1Resp"];
$mbr2Resp = $_POST["mbr2Resp"];
$mbr3Resp = $_POST["mbr3Resp"];
$mbr4Resp = $_POST["mbr4Resp"];

//引入数据库用户信息脚本
require_once("../dbuser/student.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//插入数据
$query = "INSERT INTO Party VALUES (NULL, ?, ?, ?)";
$stmt = $db->prepare($query);
$stmt->bind_param("sis", $ptyName, $crseID, $leaderID);
$stmt->execute();

//获取新创建的学习小组ID
$query = "SELECT PtyID FROM Party WHERE PtyName = ? AND CrseID = ? AND UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("sis", $ptyName, $crseID, $leaderID);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($ptyID);
$stmt->fetch();
$stmt->free_result();

$query = "INSERT INTO Member VALUES (?, ?, ?)";
$stmt = $db->prepare($query);
$stmt->bind_param("iss", $ptyID, $leaderID, $leaderResp);
$stmt->execute();

//将组员信息插入数据库
for ($indx = 1; $indx <= 4; $indx++) {
    $query = "INSERT INTO Member VALUES (?, ?, ?)";
    $id = "mbr" . $indx . "ID";
    $resp = "mbr" . $indx . "Resp";
    $stmt = $db->prepare($query);
    $stmt->bind_param("iss", $ptyID, $$id, $$resp);
    $stmt->execute();
}

echo "successful";

//关闭链接
$db->close();
exit;
?>