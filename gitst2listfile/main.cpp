#include <Windows.h>

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

#include <cassert>


// git stの結果をPaper Plane XUI(以下PPX)のListFileとして書き出し、
// PPX上でGitのコマンドを操作出来るようにする補助ツールです。

using namespace std;

string trim(const string &str) {
	int start = -1;
	int end = -1;
	
	for (string::size_type i = 0; i < str.size(); i++) {
		if (str[i] != ' ' && str[i] != '\t') {
			start = i;
			break;
		}
	}
	
	for (string::size_type i = str.size() - 1; i >= 0; i--) {
		if (str[i] != ' ' && str[i] != '\t') {
			end = i;
			break;
		}
	}
	
	if (start == -1) {
		return "";
	}
	
	return str.substr(start, end - start + 1);
}

int main(int argc, char* argv[])
{
	char str[1024];
	enum Mode {
		ChangesCommitted = 0,
		ChangesNotStaged,
		UntrackedFiles,
		UnmergedPaths,
		Other,
	};
	Mode mode = Mode::Other;
	// key:Mode
	// value: use git ...
	multimap<Mode, string> useList;
	
	// key:changes type
	// value: file name
	multimap<string, string> committedFiles;
	multimap<string, string> notStagedFiles;
	multimap<string, string> unmergedPaths;
	
	
	vector<string> untrackedFiles;

	while (cin.getline(str, 1024)) {
		string line = str;
		if (line.size() == 0) continue;
		//cout << line << endl;
		// モードセレクト
		if (line.find("Changes to be committed:") != string::npos) {
			mode = Mode::ChangesCommitted;
			continue;
		}
		if (line.find("Changes not staged for commit:") != string::npos) {
			mode = Mode::ChangesNotStaged;
			continue;
		}
		if (line.find("Untracked files:") != string::npos) {
			mode = Mode::UntrackedFiles;
			continue;
		}
		if (line.find("Unmerged paths:") != string::npos) {
			mode = Mode::UnmergedPaths;
			continue;
		}
		if (mode == Mode::Other) {
			continue;
		}
		
		// (use git .. 部分を取得する
		if (line.find("(use \"git ") != string::npos) {
			useList.insert(make_pair(mode, line));
			continue;
		}

		switch (mode) {
			case Mode::ChangesCommitted:
				{
					string::size_type index;
					if ((index = line.find(":")) != string::npos) {
						string filename = line.substr(index + string(":").size());
						filename = trim(filename);

						string changesType = line.substr(1, index - 1 + 1);
						changesType = trim(changesType);
						committedFiles.insert(make_pair(changesType, filename));
					}
				}
				break;
				
			case Mode::ChangesNotStaged:
				{
					string::size_type index;
					if ((index = line.find(":")) != string::npos) {
						string filename = line.substr(index + string(":").size());
						filename = trim(filename);

						string changesType = line.substr(1, index - 1 + 1);
						changesType = trim(changesType);
						notStagedFiles.insert(make_pair(changesType, filename));
					}
				}
				break;

			case Mode::UntrackedFiles:
				{
					string filename = line.substr(1);
					filename = trim(filename);
					if (!filename.size()) continue;
					untrackedFiles.push_back(filename);
				}
				break;
				
			case Mode::UnmergedPaths:
				{
					string::size_type index;
					if ((index = line.find(":")) != string::npos) {
						string filename = line.substr(index + string(":").size());
						filename = trim(filename);

						string changesType = line.substr(1, index - 1 + 1);
						changesType = trim(changesType);
						unmergedPaths.insert(make_pair(changesType, filename));
					}
				}
				break;

			default:
				assert(0);
				break;
		}
	}
	
	char wd[1024];
	GetCurrentDirectory(1024, wd);

	cout << ";ListFile" << endl;
	cout << ";Base=" << wd << endl;

	// committedFiles
	{
		vector<string> keys;
		for (auto it = committedFiles.begin(); it != committedFiles.end(); ++it) {
			string key = it->first;
			if (std::find(keys.begin(), keys.end(), key) == keys.end()) {
				keys.push_back(key);
			}
		}
		std::sort(keys.begin(), keys.end(), greater<string>());


		if (keys.size() > 0) {
			cout << "======== Changes to be committed: =================.committed" << endl;
			// list up use list
			for (auto it = useList.lower_bound(Mode::ChangesCommitted);
					it != useList.upper_bound(Mode::ChangesCommitted); ++it) {
				cout << it->second << ".committed" << endl;
			}
			for (size_t i = 0; i < keys.size(); i++) {
				cout << "--- " << keys[i] << endl;
				auto it = committedFiles.lower_bound(keys[i]);
				auto itEnd = committedFiles.upper_bound(keys[i]);
				for (; it != itEnd; ++it) {
					cout << it->second << endl;
				}
			}
		}
	}
	
	// notStagedFiles
	{
		vector<string> keys;
		for (auto it = notStagedFiles.begin(); it != notStagedFiles.end(); ++it) {
			string key = it->first;
			if (std::find(keys.begin(), keys.end(), key) == keys.end()) {
				keys.push_back(key);
			}
		}
		std::sort(keys.begin(), keys.end(), greater<string>());

		if (keys.size() > 0) {
			cout << "======== Changes not staged for commit: ===========.notstaged" << endl;
			for (auto it = useList.lower_bound(Mode::ChangesNotStaged);
					it != useList.upper_bound(Mode::ChangesNotStaged); ++it) {
				cout << it->second << ".notstaged" << endl;
			}
			for (size_t i = 0; i < keys.size(); i++) {
				cout << "--- " << keys[i] << endl;
				auto it = notStagedFiles.lower_bound(keys[i]);
				auto itEnd = notStagedFiles.upper_bound(keys[i]);
				for (; it != itEnd; ++it) {
					cout << it->second << endl;
				}
			}
		}
	}
	
	// untrackedFiles
	{
		if (untrackedFiles.size() > 0) {
			cout << "======== Untracked files: =========================.untracked" << endl;
			for (auto it = useList.lower_bound(Mode::UntrackedFiles);
					it != useList.upper_bound(Mode::UntrackedFiles); ++it) {
				cout << it->second << ".untracked" << endl;
			}
			for (size_t i = 0; i < untrackedFiles.size(); i++) {
				cout << untrackedFiles[i] << endl;
			}
		}
	}
	
	// unmergedPaths
	{
		vector<string> keys;
		for (auto it = unmergedPaths.begin(); it != unmergedPaths.end(); ++it) {
			string key = it->first;
			if (std::find(keys.begin(), keys.end(), key) == keys.end()) {
				keys.push_back(key);
			}
		}
		std::sort(keys.begin(), keys.end(), greater<string>());

		if (keys.size() > 0) {
			cout << "======== Unmerged paths: =========================.unmerged" << endl;
			for (auto it = useList.lower_bound(Mode::UnmergedPaths);
					it != useList.upper_bound(Mode::UnmergedPaths); ++it) {
				cout << it->second << ".unmerged" << endl;
			}
			for (size_t i = 0; i < keys.size(); i++) {
				cout << "--- " << keys[i] << endl;
				auto it = unmergedPaths.lower_bound(keys[i]);
				auto itEnd = unmergedPaths.upper_bound(keys[i]);
				for (; it != itEnd; ++it) {
					cout << it->second << endl;
				}
			}
		}
	}

	return 0;
}
