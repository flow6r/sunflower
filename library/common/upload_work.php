<?php
/*上传作业文件的脚本*/
//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDt = date("_YmdHis");
$cmplDt = date("Y-m-d H:i:s");
$upldDt = $cmplDt;

//获取课程任务ID、用户ID和用户角色
session_start();
$msID = intval($_SESSION["currMs"]["MsID"]);
$msName = $_SESSION["currMs"]["MsName"];
$msDesc = $_SESSION["currMs"]["MsDesc"];
$usrID = $_SESSION["userInfo"]["UsrID"];
$usrRole = $_SESSION["userInfo"]["UsrRole"];


//检查文件上传错误
if ($_FILES["newWork"]["error"] === 1) {
    echo "<script>alert('超出文件上传大小');</script>";
    exit;
}

if ($_FILES["newWork"]["type"] != "application/x-zip-compressed") {
    echo "<script>alert('上传文件格式错误，请上传zip格式文件');</script>";
    exit;
} else {
    $extName = ".zip";
    $achvFmt = substr($extName, 1);
}

//将文件移动至指定位置
$trgtPath = $docRoot . "/data/work/" . $usrID . $currDt . $extName;

if (is_uploaded_file($_FILES["newWork"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newWork"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//引入数据库用户信息脚本
require_once("../dbuser/student.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "<script>alert('连接数据库失败，请联系管理员并反馈问题');</script>";
    exit;
}

//更新任务进度记录数据库
$wrkPath = "../data/work/" . $usrID . $currDt . $extName;
$query = "UPDATE Progress SET MsStat = 'cmpled', CmplDt = ?, WrkPath = ? WHERE MsID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ssi", $cmplDt, $wrkPath, $msID);
$stmt->execute();

//新建成就记录
$achvPath = $wrkPath;
$query = "INSERT INTO Achievement VALUES (NULL, ?, ?, ?, ?, ?, ?, 0)";
$stmt = $db->prepare($query);
$stmt->bind_param("ssssss", $msName, $msDesc, $achvFmt, $usrID, $upldDt, $achvPath);
$stmt->execute();

echo "<script>alert('成功上传作业');</script>";

//关闭链接
$db->close();
exit;
?>