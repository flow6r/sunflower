<?php
/*批量添加课程记录的脚本*/
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xls;

//引入PHPSpreadsheet文件
require_once("../PHPSpreadsheet/vendor/autoload.php");

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//检查文件类型
if (
    $_FILES["crseInfoFile"]["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && $_FILES["crseInfoFile"]["type"] != "application/vnd.ms-excel"
) {
    echo "<script>alert('请上传xls或xlsx格式的学生用户信息文件');</script>";
    exit;
}

//获取当前用户的姓名和角色信息
session_start();
$usrRole = $_SESSION["userInfo"]["UsrRole"];
$usrName = $_SESSION["userInfo"]["UsrName"];

//设置文件基本名
$baseName = "CrseInfoTmpl_" . $usrName . $currDateTime;

//设置文件后缀名
$extName = null;
if ($_FILES["crseInfoFile"]["type"] === "application/vnd.ms-excel") $extName = ".xls";
else $extName = ".xlsx";

//设置文件路径
$newCrsesInfoFile = $docRoot . "/data/upload/" . $baseName . $extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["crseInfoFile"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["crseInfoFile"]["tmp_name"], $newCrsesInfoFile)) {
        echo "<script>alert('移动课程记录信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//尝试读取文件
if ($extName === ".xls") $readFile = new Xls();
else $readFile = new Xlsx();
$spreadsheet = $readFile->load($newCrsesInfoFile);
$newCrsesInfo = $spreadsheet->getActiveSheet(0);

//获取数据行数
$dataRows = $newCrsesInfo->getHighestRow() - 3;
$begnRows = 4;

//声明课程记录信息数组
$newCrsesInfoAray = array();

//声明无法插入的学生用户信息数组
$canIsrt = true;
$cantIsrtCrseInfoAray = array();
$cantIsrtCrseInfoIndx = 0;

//遍历数据表，读取数据
for ($indx = 0; $indx < $dataRows; $indx++, $begnRows++) {
    $newCrsesInfoAray[$indx]["CrseName"] = $newCrsesInfo->getCellByColumnAndRow(1, $begnRows)->getValue();
    $newCrsesInfoAray[$indx]["CrseDesc"] = $newCrsesInfo->getCellByColumnAndRow(2, $begnRows)->getValue();
    $newCrsesInfoAray[$indx]["UsrID"] = $newCrsesInfo->getCellByColumnAndRow(3, $begnRows)->getValue();
}

//将数据保存为JSON格式并写入文件
// $crses = json_encode($newCrsesInfoAray, JSON_UNESCAPED_UNICODE);
// file_put_contents($dataRows.".json", $crses);

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
    echo "<script>alert('连接数据库失败，请联系管理员并反馈问题');</script>";
    exit;
}

//查询数据库检查用户是否存在
for ($indx = 0; $indx < count($newCrsesInfoAray); $indx++) {
    $currUsrID = $newCrsesInfoAray[$indx]["UsrID"];
    $query = "SELECT UsrID FROM User WHERE UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $currUsrID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $canIsrt = false;
        $cantIsrtCrseInfoAray[$cantIsrtCrseInfoIndx++] = $currUsrID;
    }
    $stmt->free_result();
}

//插入课程记录或者提示错误信息
if ($canIsrt) {
    for ($indx = 0; $indx < count($newCrsesInfoAray); $indx++) {
        $query = "INSERT INTO Course VALUES (NULL, ?, ?, NULL, ?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sss", $newCrsesInfoAray[$indx]["CrseName"],
        $newCrsesInfoAray[$indx]["CrseDesc"], $newCrsesInfoAray[$indx]["UsrID"],);
        $stmt->execute();
    }

    echo "<script>alert('成功导入" . $dataRows . "条课程记录');</script>";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantIsrtCrseInfoAray); $indx++) {
        $tips .= "\\n用户ID：" . $cantIsrtCrseInfoAray[$indx] . "不存在";
    }
    echo "<script>alert('您导入的信息中包含不存在的用户记录" . $tips . "\\n请检查无误后再执行批量导入的操作');</script>";
    unlink($newCrsesInfoFile);
}

//关闭链接
$db->close();
exit;
?>