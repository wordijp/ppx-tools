# gitst2listfile
================

git statusの結果をPaper Plane xUIのListFileへと変換します。

## Usage

    > git status | gitst2listfile

## Demo

    > echo %CD%
	E:\work\C++\HelloWorld

    > git status
    On branch next
    Changes not staged for commit:
      (use "git add/rm <file>..." to update what will be committed)
      (use "git checkout -- <file>..." to discard changes in working directory)
    
            modified:   main.cpp
            deleted:    next.txt
    
    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    
            newfile.txt
    
    no changes added to commit (use "git add" and/or "git commit -a")

	> git status | gitst2listfile
    ;ListFile
    ;Base=E:\work\C++\HelloWorld
    ======== Changes not staged for commit: ===========.notstaged
      (use "git add/rm <file>..." to update what will be committed).notstaged
      (use "git checkout -- <file>..." to discard changes in working directory).notstaged
    --- modified:
    main.cpp
    --- deleted:
    next.txt
    ======== Untracked files: =========================.untracked
      (use "git add <file>..." to include in what will be committed).untracked
    no changes added to commit (use "git add" and/or "git commit -a").untracked
    newfile.txt

## Binaries

[Windows Binaries](https://github.com/wordijp/gitst2listfile/releases)

## License

[MIT License](http://opensource.org/licenses/MIT).

