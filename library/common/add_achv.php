<?php
/*添加新成就的脚本*/
//获取POST请求的数据
$achvTitl = $_POST["achvTitl"];
$achvDesc = $_POST["achvDesc"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDt = date("_YmdHis");
$upldDt = date("Y-m-d H:i:s");

//获取当前用户的ID和角色信息
session_start();
$usrID = $_SESSION["userInfo"]["UsrID"];

//检查文件上传错误
if ($_FILES["newAchv"]["error"] === 1) {
    echo "<script>alert('超出单个文件上传大小');</script>";
    exit;
}

//检查文件类型并设置后置名
$extName = null;
switch ($_FILES["newAchv"]["type"]) {
    case "image/bmp" : $extName = ".bmp"; break;
    case "image/gif" : $extName = ".gif"; break;
    case "image/jpeg": $extName = ".jpg"; break;
    case "image/png" : $extName = ".png"; break;
    case "application/pdf" : $extName = ".pdf"; break;
    case "application/msword" : $extName = ".doc"; break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : $extName = ".docx"; break;
    case "application/vnd.ms-excel" : $extName = ".xls"; break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : $extName = ".xlsx"; break;
    case "application/vnd.ms-powerpoint" : $extName = ".ppt"; break;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation" : $extName = ".pptx"; break;
    case "application/x-zip-compressed" : $extName = ".zip"; break;
    case "audio/mpeg" : $extName = ".mp3"; break;
    case "audio/x-m4a" : $extName = ".m4a"; break;
    case "video/mp4" : $extName = ".mp4"; break;
    case "video/x-matroska" : $extName = ".mkv"; break;
    default: echo "<script>alert('您上传的文件不符合服务器支持的格式，当前支持如下格式\\nbmp、gif、ipg、png、pdf、" .
    "\\ndoc、docx、xls、xlsx、ppt、pptx、zip、\\nmp3、m4a、mp4、mkv');</script>"; exit;
}

//设置文件格式字段
$achvFmt = substr($extName, 1);

//将文件移动至指定位置
$trgtPath = $docRoot . "/data/achv/" . $usrID . $currDt . $extName;

if (is_uploaded_file($_FILES["newAchv"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newAchv"]["tmp_name"], $trgtPath)) {
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

//新建成就记录
$acvhPath = "../data/achv/" . $usrID . $currDt . $extName;
$query = "INSERT INTO Achievement VALUES (NULL, ?, ?, ?, ?, ?, ?, 0)";
$stmt = $db->prepare($query);
$stmt->bind_param("ssssss", $achvTitl, $achvDesc, $achvFmt, $usrID, $upldDt, $acvhPath);
$stmt->execute();

echo "<script>alert('成功上传新成就');</script>";

//关闭链接
$db->close();
exit;
?>