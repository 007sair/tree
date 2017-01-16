;$(function() {

    //json tree 结构固定逻辑
    var json_tree = [
        {
            text: 'A',
            child: [
                {
                    text: 'a',
                    child: [
                        {
                            text: 'a1',
                            id: 1
                        },
                        {
                            text: 'a2',
                        }
                    ]
                },
                {
                    text: 'b',
                    child: [
                        {
                            text: 'b1'
                        },
                        {
                            text: 'b2',
                            child: [
                                {
                                    text: 'b21'
                                },
                                {
                                    text: 'b22',
                                    child: [
                                        {
                                            text: 'b221'
                                        },
                                        {
                                            text: 'b222'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            text: 'b3'
                        }
                    ]
                }
            ]
        },
        {
            text: 'B',
            child: [
                {
                    text: 'a'
                },
                {
                    text: 'b',
                    child: [
                        {
                            text: 'b1',
                            child: [
                                {
                                    text: 'b11'
                                },
                                {
                                    text: 'b12'
                                }
                            ]
                        },
                        {
                            text: 'b2'
                        },
                        {
                            text: 'b3'
                        }
                    ]
                }
            ]
        },
        {
            text: 'C',
            child: [
                {
                    text: 'a',
                    id: 111
                },
                {
                    text: 'b',
                    id: 222
                },
                {
                    text: 'c',
                    id: 333
                }
            ]
        }
    ];

    //数据展示区数组
    var aList = [];

    var oTree = document.getElementById('tree');
    var LEVEL = 0; //tree层级
    var pre = 'sid_'; //id前缀
    var path = ''; //路径

    /**
     * 创建li
     * @param  {[object]} parent [dom节点]
     * @param  {[object]} obj    [json_tree中的object]
     * @param  {[number]} level  [tree层级，第一层为1]
     * @param  {[string]} path   [数据节点的路径 格式为：xxx/xxx/xxx]
     */
    function createLI(parent, obj, level, path) {
        var oLi = document.createElement('li');
        var oDiv = document.createElement('div');
        var oBtn = document.createElement('input');
        var oI = document.createElement('i');
        var oSpan = document.createElement('span');
        var sPath = obj.text + '/';

        oSpan.className = 'checkbox';

        oBtn.type = 'checkbox';
        oLi.appendChild(oDiv);

        path += sPath;

        oBtn.className = 'btn';
        oBtn.setAttribute('data-sid', pre + guid())
        oBtn.setAttribute('data-path', path.split(sPath)[0]);

        oDiv.innerHTML = obj.text;
        oDiv.appendChild(oI);
        oDiv.appendChild(oSpan);
        oDiv.appendChild(oBtn);

        if (obj.child) { //如果有子集
            oDiv.className = 'crotch tit';
            oBtn.setAttribute('data-type', 'title');
            level++;
            createUL(oLi, obj.child, level, path);
        } else { //文本
            oDiv.className = 'crotch text';
            oBtn.setAttribute('data-type', 'text');
            oBtn.setAttribute('data-value', obj.text);
            oBtn.id = obj.id; //数据库给的id
        }

        parent.appendChild(oLi);
    }

    /**
     * 创建ul
     * @param  {[object]} parent [dom节点]
     * @param  {[array]}  arr    [一组li的数据集合]
     * @param  {[number]} level  [tree层级，第一层为1]
     * @param  {[string]} path   [数据节点的路径 格式为：xxx/xxx/xxx]
     */
    function createUL(parent, arr, level, path) {
        var oUL = document.createElement('ul');
        for (var i = 0; i < arr.length; i++) {
            createLI(oUL, arr[i], level, path);
        };
        parent.appendChild(oUL);
        if (level == 0) {
            oUL.className = 'tree'
        };
        oUL.setAttribute('data-level', level);
        // oUL.setAttribute('data-path', path);
    }

    createUL(oTree, json_tree, LEVEL, path);


    /**
     * 点击input[type=checkbox]时 设置父子节点中input的对应关系
     * @param  {[type]} $curBtn 当前被点击的元素
     */
    function clickCheckbox($curBtn) { //$curBtn 当前被点击的input元素

        checkParent($curBtn); //向上检测$curBtn与父级中的input的关系
        checkChild($curBtn);  //向下

        //根据当前input判断同级input是否全被选中，若全选，父级选中。一直递归向上进行重复判断
        function checkParent($curBtn) {
            var $ul = $curBtn.closest('ul');
            if (!$curBtn.closest('ul').length) return false; //如果当前节点的上级没有父节点，说明是根节点，则停止递归
            var $parent = $ul.siblings('.crotch').find('.btn');
            var $brother = $ul.children('li').children('.crotch').find('.btn');
            var len = $brother.length;
            var count = 0;

            $brother.each(function(index, el) {
                if ($(el).prop('checked')) {
                    count++
                } else {
                    count--
                }
            });

            if (count === len) { //父级选中
                checked($parent, true);
            } else { //父级未选中
                checked($parent, false);
            }

            checkParent($parent)
        }

        //根据当前input判断下一节点input是否全选 下一层全选后继续传递   递归到数据节点为止
        function checkChild($curBtn) {
            var $sibUl = $curBtn.parent('.crotch').siblings('ul');
            if (!$sibUl.length) return false; //如果当前节点没有子节点，说明为数据节点，则停止递归
            var $child;
            var count = 0,
                len;

            $child = $sibUl.children('li').children('.crotch').find('.btn');
            len = $child.length;

            if ($curBtn.prop('checked')) {
                checked($child, true);
            } else {
                checked($child, false);
            }

            checkChild($child)
        }
    }

    //checkbox勾选与否时的dom操作
    function checked($btn, isChecked) {
        if (isChecked) {
            $btn.prop('checked', true).addClass('checked').parent('.crotch').addClass('checked');
        } else {
            $btn.prop('checked', false).removeClass('checked').parent('.crotch').removeClass('checked');
        }
    }

    function getData($btn) { //$btn
        return {
            sid: $btn.data('sid'),
            path: $btn.data('path'),
            text: $btn.data('value'),
            id: $btn.attr('id')
        }
    }

    //根据sid删除对应数据
    function delListData(sid){
        for (var i = 0; i < aList.length; i++) {
            if (sid == aList[i].sid) {
                aList.splice(i, 1);
            };
        };
    }

    function toggle(ele, className) {
        if (ele.hasClass(className)) {
            ele.removeClass(className)
        } else {
            ele.addClass(className)
        }
    }

    //根据arr渲染数据到数据展示区 逻辑判断可加强
    function renderList(arr) {
        var html = '';
        for (var i = 0; i < arr.length; i++) {
            html += '<li data-sid="'+ arr[i].sid +'" data-path="'+ arr[i].path +'"><i class="del">x</i>'+ arr[i].text +'<span class="path">('+ arr[i].path +')</span></li>';
        };
        $('#list').empty().append(html);
    }


    //标题节点的展开收起
    $('#tree').on('click', '.crotch', function(e) {
        if (e.target.nodeName !== 'INPUT') {
            var $li = $(this).parent('li');
            var $childUL = $li.children('ul');

            if ($childUL.length) { //有子集
                toggle($childUL, 'ul-active');
                toggle($li, 'li-expand');
                toggle($(this), 'tit-expand');
            }
        }
    });


    //选中input 向aList中push数据 数据包含sid 文本 路径
    //取消input 获取到被取消的input的sid，循环aList  找到对应的sid并删除其数据
    //list右侧删除 点删除时获取到当前需要删除的元素sid 遍历aList 找到并删除
    $('#tree').on('click', '.btn', function() {

        if ($(this).prop('checked')) { //根据当前input 设置数据
            addData($(this));
            checked($(this), true);
        } else {
            delData($(this));
            checked($(this), false);
        }

        clickCheckbox($(this)); //设置上下级的勾选状态 顺序必须在设置data的后面

        function addData($curBtn) {
            if ($curBtn.data('type') == 'title') {
                $curBtn.parent('.crotch').siblings('ul').find('.btn').each(function(index, el) {
                    var data = getData($(this));
                    if ($(this).data('type') == 'text' && !$(this).prop('checked')) {
                        aList.push(data);
                    };
                });
            } else {
                aList.push(getData($curBtn));
            }
        }

        function delData($curBtn){
            if ($curBtn.data('type') == 'title') {
                $curBtn.parent('.crotch').siblings('ul').find('.btn').each(function(index, el) {
                    var sid = $(this).data('sid');
                    delListData(sid);
                });
            } else {
                var sid = $curBtn.data('sid');
                delListData(sid);
            }
        }

        console.log(aList)

        renderList(aList);
    });
    

    //删除选中数据
    $('#list').on('click', '.del', function() {
        var sid = $(this).parent('li').data('sid');
        var $btn = $('[data-sid="'+ sid +'"]');
        checked($btn, false);
        clickCheckbox($btn);
        delListData(sid);
        renderList(aList);
    });


    function guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + S4());
    }


});