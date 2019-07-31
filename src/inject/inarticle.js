// based on 2019/7/30 in-article algorithm
function test_dable_inarticle({
    pos_rate = 50, // 50%
    show_step = true,
    auto_scroll = true,
    step_delay = 200, // ms
  } = {}) {
  const sleep = (miliseconds) => new Promise(resolve => setTimeout(resolve, miliseconds));
  let style_remove_queue = [];
  const runRemove = () => {
    style_remove_queue.forEach(f=>f());
    style_remove_queue = [];
  };
  const remove_style = (el) => () => el.style = "";

  const checkEnoughTextAfterEl = async function(el, t = "") {
    const specialTagsBlockText = ['img', 'iframe', 'figure'];
    var has_special_tags, j, k, len, len1, ref, tag;
    if (show_step) {
      try {
        const range = document.createRange(el);
        range.selectNodeContents(el);
        const rects = range.getClientRects();
        if (auto_scroll && rects.length > 0) {
          const element_center = rects[0].top + rects[0].height / 2 - window.screen.availHeight / 3;
          window.scrollBy({ top: element_center, behavior: 'smooth' });
        }
        el.style = "background-color: skyblue; border: 2px solid black;";
        await sleep(step_delay);
        style_remove_queue.push(remove_style(el));
      } catch(e){
        console.log(el, e);
      }
    }
    t += (el ? (ref = el.innerHTML) != null ? ref.toLowerCase() : void 0 : void 0) || el.textContent;
    has_special_tags = false;
    for (j = 0, len = specialTagsBlockText.length; j < len; j++) {
      tag = specialTagsBlockText[j];
      if (t.indexOf(`<${tag}`) > -1) {
        has_special_tags = true;
        break;
      }
    }
    while (t.indexOf('<script') > -1) {
      t = t.substr(0, t.indexOf('<script')) + t.substr(t.indexOf('<\/script>') + 9);
    }
    while (t.indexOf('<style') > -1) {
      t = t.substr(0, t.indexOf('<style')) + t.substr(t.indexOf('<\/style>') + 8);
    }
    for (k = 0, len1 = specialTagsBlockText.length; k < len1; k++) {
      tag = specialTagsBlockText[k];
      t = t.replace(new RegExp(`<${tag}(.|[\r\n])*`), '');
    }
    t = t.replace(/<[^>]+>/g, '').replace(/^\s+/, '').replace(/\s+$/, '');
    // tolerance for text length
    console.log(`150+ characters after the red target? ${t.length}`, el);
    if (t.length > 150) {
      runRemove();
      return true;
    } else if (!t.length) {
      runRemove();
      return false;
    } else if (!has_special_tags && (el != null ? el.nextSibling : void 0)) {
      return checkEnoughTextAfterEl(el.nextSibling, t);
    } else {
      runRemove();
      return false;
    }
  };

  const findTargetNode = async function({el, l, pos_rate}) {
    const delHandler = (el) => () => el.parentNode.removeChild(el);
    const markTempTarget = (el) => {
      try{
        let a = document.createElement("div");
        a.style = "border: 2px solid red";
        el.parentNode.insertBefore(a, el);
        return delHandler(a);
      } catch(e) {
        return d => d;
      }
    };
    var _el, i, target_node_idx;
    target_node_idx = Math.floor(l * pos_rate / 100) - 1 || l - 1;
    let remove = markTempTarget(el.childNodes[target_node_idx]);
    if (await checkEnoughTextAfterEl(el.childNodes[target_node_idx])) {
      return el.childNodes[target_node_idx];
    }
    remove();
    i = 0;
    while (i++ < l) {
      if (target_node_idx + i < l) {
        _el = el.childNodes[target_node_idx + i];
        remove = markTempTarget(_el);
        if (_el && await checkEnoughTextAfterEl(_el)) {
          remove();
          return _el;
        }
        remove();
      }
      if (target_node_idx - i >= 0) {
        _el = el.childNodes[target_node_idx - i];
        remove = markTempTarget(_el);
        if (_el && await checkEnoughTextAfterEl(_el)) {
          remove();
          return _el;
        }
        remove();
      }
    }
    return false;
  };

  const injectPlaceholder = async function(el, {pos_rate}) {
    var l, l2, placeholder, ref, target_node;
    if (!el || !((ref = el.childNodes) != null ? ref.length : void 0)) {
      alert("itemprop=\"articleBody\" element has no contents");
      return null;
    }
    l = el.childNodes.length;
    l2 = el.children.length;
    if (l <= 3 && l2 === 1) {
      return await injectPlaceholder(el.children[0], {pos_rate});
    }
    target_node = await findTargetNode({el, l, pos_rate});
    runRemove();
    if (!target_node) {
      alert("found no proper place (scarce text)");
      return false;
    }
    placeholder = document.createElement("div");
    placeholder.className = "dable_placeholder";
    placeholder.style = "height: 50px !important; width: 100% !important; background-color: blue !important;";
    el.insertBefore(placeholder, target_node);
    return placeholder;
  };

  const init = function() {
    const body_el = document.querySelector('[itemprop="articleBody"],.__dable_article_body');
    if (!body_el) {
      alert("no elemnet has itemprop=\"articleBody\"");
      return;
    }
    const placeholder_el = body_el.querySelector('.dable_placeholder');
    if (placeholder_el) placeholder_el.outerHTML = "";
    injectPlaceholder(body_el, {pos_rate});
  };
  init();
}