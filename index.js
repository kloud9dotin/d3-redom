const { el, svg, mount, list, setChildren } = redom

var data = [
    {x: 0, y: 10}, 
    {x: 10, y: 40}, 
    {x: 20, y: 30}, 
    {x: 30, y: 70}, 
    {x: 40, y: 0}
  ]

class LineChart {
    constructor() {
        var margin = {top: 10, right: 20, bottom: 20, left: 30},
            width = 500,
            height = 300,
            xaxis_offset = 280,
            yaxis_offset = 30,
            auto_resize = 1
        this.height = function(value) {
            if (!arguments.length) return height
                height = value
        }
        this.width = function(value) {
            if (!arguments.length) return width
                width = value
        }
        this.margin = function(value) {
            if (!arguments.length) return margin
        }
        this.xaxis_offset = function(value) {
            if (!arguments.length) return xaxis_offset
            xaxis_offset = value
        }
        this.yaxis_offset = function(value) {
            if (!arguments.length) return yaxis_offset
            yaxis_offset = value
        }
        this.auto_resize = function(value) {
            if (!arguments.length) return auto_resize
            auto_resize = value
        }
        this.el = svg("svg", {id:"graph", width:0, height:0})
            
    }
    update() {
        if(this.auto_resize() > 0) {
        let width = this.el.parentElement.clientWidth
        this.width(width/2)
        this.height(width * 0.28)
        this.xaxis_offset(width * 0.28 -20)
        }
        var x = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).range([this.margin().left, this.width() - this.margin().right])
        var y = d3.scaleLinear().domain([0, d3.max(data, d => d.y)]).range([this.height() - this.margin().bottom, this.margin().top])
        this.el.setAttribute("width", this.width())
        this.el.setAttribute("height", this.height())
        this.line = svg("path", {style:"fill:none;stroke:#33c7ff;stroke-width:2;",d:d3.line().x(d => x(d.x)).y(d => y(d.y))(data)})
        this.x_ticks = list(svg("g"), xTicks)
        this.y_ticks = list(svg("g"), yTicks)
        this.x_axis = svg("g" , {transform:"translate(0,"+ this.xaxis_offset()+")",style:"text-anchor:middle"}, 
        svg("path", {style:"fill:none;stroke:currentcolor;stroke-width:1;",d:"M" + (this.margin().left + 0.5) + ",0.5H" + (this.width() - this.margin().right-0.5) }),
        this.x_ticks)
        this.y_axis = svg("g", {transform:"translate("+ this.yaxis_offset()+",0)",style:"text-anchor:end"}, 
        svg("path", {style:"fill:none;stroke:currentcolor;stroke-width:1;",d:"M0.5," + (this.height() - this.margin().bottom+ 0.5) + "V" + (this.margin().top - 0.5) }),
        this.y_ticks)
        setChildren(this.el, [this.line, this.x_axis, this.y_axis])
        let xTickData = x.ticks().map(function(d){return [x(d),d]})
        let yTickData = y.ticks().map(function(d){return [y(d) ,d]})
        this.x_ticks.update(xTickData)
        this.y_ticks.update(yTickData)
    }
}

class xTicks {
    constructor() {
        this.line
        this.text
        this.el = svg("g", {style:"opacity:1;"}) 
    }
    update(data) {
        this.el.setAttribute("transform", "translate(" + data[0] + ",0)")
        this.line = svg("line", {style:"stroke:currentcolor;",y2:"6"}) 
        this.text = svg("text", {style:"fill:currentcolor;",y:9, dy:"0.71em"}, data[1])
        setChildren(this.el, [this.line, this.text])
    }
}

class yTicks {
    constructor() {
        this.line
        this.text
        this.el = svg("g", {style:"opacity:1;"}) 
    }
    update(data) {
        this.el.setAttribute("transform", "translate(0," + data[0] + ")")
        this.line = svg("line", {style:"stroke:currentcolor;",x2:"-6"}) 
        this.text = svg("text", {style:"fill:currentcolor;",x:-9, dy:"0.32em"}, data[1])
        setChildren(this.el, [this.line, this.text])
    }
}


let graph = new LineChart()
let total = el("div.w-100", graph, el("div.pa2", el("br"), el("h3", "docs"), el("p", "Use graph.<property>() to get the height of the graph and graph.<property>(x) to set height to x."),
    el("p", "Properties available are height,width, xaxis_offset, yaxis_offset, auto_resize. margin is a read-only property."),
    el("p", "Use graph.update() to update graph"),
    el("p", "To change values of plotted point edit variable data"),
    el("p", "Set auto_resize > 0 to enable and auto_resize = 0 to disable.(default = enabled)")))

mount(document.body, total);

graph.update()


window.onresize = function() {
    graph.update()
}