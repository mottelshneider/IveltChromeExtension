function previousPage() {
	document.querySelectorAll(".previous a")[0].click();
}

function nextPage() {
	document.querySelectorAll(".next a")[0].click();
}

function scrollTop() {
	window.scrollTo({ top: 0, behavior: 'instant' });
}

function scrollBottom() {
	window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' } );
}

function sendPost(post) {
	if (post) {
		post.click();
	}
}

function getHelperSettingsNode() {
	return document.getElementById("iveltHelperSettings");
}

function isBbcodeFormatShortcutEnabled() {
	const settingsNode = getHelperSettingsNode();
	return settingsNode && settingsNode.getAttribute("data-bbcode-format-shortcuts") === "true";
}

function getMessageEditor(target) {
	if (!target || target.nodeName !== "TEXTAREA") {
		return null;
	}

	if (target.name === "message" || target.id === "message") {
		return target;
	}

	return null;
}

function wrapSelectionWithTag(textarea, openTag, closeTag) {
	const selectionStart = textarea.selectionStart;
	const selectionEnd = textarea.selectionEnd;

	if (typeof selectionStart !== "number" || typeof selectionEnd !== "number") {
		return false;
	}

	const selectedText = textarea.value.slice(selectionStart, selectionEnd);
	const replacement = openTag + selectedText + closeTag;
	const scrollTop = textarea.scrollTop;

	textarea.setRangeText(replacement, selectionStart, selectionEnd, "end");

	if (selectedText) {
		textarea.setSelectionRange(selectionStart + openTag.length, selectionStart + openTag.length + selectedText.length);
	} else {
		textarea.setSelectionRange(selectionStart + openTag.length, selectionStart + openTag.length);
	}

	textarea.scrollTop = scrollTop;
	textarea.dispatchEvent(new Event("input", { bubbles: true }));
	return true;
}

function handleBbcodeFormatShortcut(e) {
	const textarea = getMessageEditor(e.target);
	if (!textarea || !isBbcodeFormatShortcutEnabled()) {
		return false;
	}

	if (e.altKey) {
		return false;
	}

	const hasPrimaryModifier = e.ctrlKey || e.metaKey;
	if (!hasPrimaryModifier || e.shiftKey) {
		return false;
	}

	const key = e.key.toLowerCase();
	const tagMap = {
		b: ["[b]", "[/b]"],
		i: ["[i]", "[/i]"],
		u: ["[u]", "[/u]"]
	};

	if (!tagMap[key]) {
		return false;
	}

	e.preventDefault();
	return wrapSelectionWithTag(textarea, tagMap[key][0], tagMap[key][1]);
}

function previewPost() {
	document.getElementsByName("preview")[0].click();
}

function toggleNotification() {
	const notificationNode = document.getElementById("notification_list_button");
	if (notificationNode) {
        notificationNode.scrollIntoView({ behavior: "instant", block: "start" });
		notificationNode.click();
	}
}

function nextNotification() {
  const nodes = document.querySelectorAll("li.bg2 .notification-block");
  for (const node of nodes) {
    const url = node.dataset.realUrl || node.href;
    if (url) {
      window.location.href = url;
      break;
    }
  }
}

function checkKey(e) {
    const post = document.getElementsByName("post")[0] || document.getElementsByName("submit")[0] || false;
    const isAltKey = e.altKey || e.getModifierState('AltGraph');

	if (handleBbcodeFormatShortcut(e)) {
		return;
	}

    if (e.code === "KeyA" && isAltKey) {
		window.location.href = 'https://www.ivelt.com/forum/search.php?search_id=active_topics';
	}

    if (e.key === "Enter" && e.ctrlKey && post) {
		sendPost(post);
	}

    if (e.code === "KeyV" && isAltKey && post) {
		previewPost();
	}

    if (e.code === "KeyN" && isAltKey) {
		toggleNotification();
	}

    if (e.code === "KeyM" && isAltKey) {
		nextNotification();
	}

	e = e || window.event;

    if (e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA" || e.target.isContentEditable) {
        return;
    }

    if (e.key === "ArrowLeft") {
		try {
			nextPage();
		} catch {
			console.log("attempted to go after last page");
		}
    } else if (e.key === "ArrowRight") {
		try {
			previousPage();
		} catch {
			console.log("attempted to go before first page");
		}
    } else if (e.key === "ArrowUp") {
		scrollTop();
    } else if (e.key === "ArrowDown") {
		scrollBottom();
	}
}

let post = document.getElementsByName("post")[0] || document.getElementsByName("submit")[0] || false;
if (post) {
	post.setAttribute("title", "שיק (שארטקאט קאנטראל+ענטער)");
}
document.onkeydown = checkKey;

